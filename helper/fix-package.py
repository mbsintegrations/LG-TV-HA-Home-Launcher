"""Set only reviewed per-device ownership in a local IPK; never contacts a TV."""
import io, json, pathlib, sys, tarfile

def patch(filename, options, probe=False):
    p = pathlib.Path(filename)
    for key in ('developerUid', 'sharedGid') + (() if probe else ('nativeUid',)):
        if type(options.get(key)) is not int or not 1 <= options[key] < 65535:
            raise ValueError('Verify a non-root numeric ' + key)
    b = p.read_bytes()
    if b[:8] != b'!<arch>\n': raise ValueError('Not an IPK ar archive')
    offset, members, changed = 8, [], 0
    while offset < len(b):
        h = b[offset:offset+60]
        if len(h) != 60 or h[58:60] != b'`\n': raise ValueError('Invalid ar member')
        size = int(h[48:58]); data = b[offset+60:offset+60+size]
        if len(data) != size: raise ValueError('Truncated ar member')
        if h[:16].decode().strip().rstrip('/') == 'data.tar.gz':
            out = io.BytesIO()
            with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as src, tarfile.open(fileobj=out, mode='w:gz') as dst:
                for entry in src:
                    name = entry.name.lstrip('./')
                    if '..' in pathlib.PurePosixPath(name).parts: raise ValueError('Unsafe archive path')
                    if name.endswith(('/detach', '/relay')): entry.mode = 0o755
                    if any(('/'+app+'/state') in ('/'+name) for app in ('com.mbs.communityhomehelper', 'com.mbs.communityhome.helper')):
                        entry.uid=options['developerUid']; entry.gid=options['sharedGid']; entry.uname=''; entry.gname=''
                        entry.mode=0o770 if entry.isdir() else 0o660; changed+=1
                    if name.endswith('/ha-config.json'):
                        if probe: raise ValueError('Probe must not contain credentials')
                        entry.uid=options['nativeUid']; entry.gid=options['sharedGid']; entry.mode=0o600; entry.uname=''; entry.gname=''
                    dst.addfile(entry, src.extractfile(entry) if entry.isfile() else None)
            data = out.getvalue()
        members.append((h,data)); offset+=60+size+(size&1)
    if not changed: raise ValueError('Expected state directory missing')
    output=bytearray(b'!<arch>\n')
    for h,data in members: output+=h[:48]+str(len(data)).ljust(10).encode()+h[58:]+data+(b'\n' if len(data)&1 else b'')
    p.write_bytes(output)

if __name__ == '__main__':
    patch(sys.argv[1], json.loads(pathlib.Path(sys.argv[2]).read_text()), '--probe' in sys.argv[3:])
    print('Reviewed device-specific permissions written to local package.')
