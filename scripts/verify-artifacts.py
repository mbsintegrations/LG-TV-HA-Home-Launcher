"""Inspect local build artifacts without extracting credential contents to stdout."""
import io, json, pathlib, tarfile, sys, zipfile

def ipk(p):
    b=pathlib.Path(p).read_bytes(); assert b[:8]==b'!<arch>\n'; offset=8; entries={}
    while offset<len(b):
        h=b[offset:offset+60]; size=int(h[48:58]); data=b[offset+60:offset+60+size]
        if h[:16].decode().strip().rstrip('/')=='data.tar.gz':
            with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as t:
                for m in t:
                    if m.isfile(): entries[m.name]=(m,t.extractfile(m).read())
        offset+=60+size+(size&1)
    return entries

def inspect(p):
    entries=ipk(p); connections=[v for k,v in entries.items() if k.endswith('/connection.json')]
    info={'filename':pathlib.Path(p).name,'files':len(entries)}
    if connections:
        c=json.loads(connections[0][1]);info['hasToken']=bool(c.get('token'))
        assert any(k.endswith('/profile.json') for k in entries)
        theme=[v[1].decode() for k,v in entries.items() if k.endswith('/theme.css')][0];assert 'linear-gradient' in theme
        meta=json.loads([v[1] for k,v in entries.items() if k.endswith('/appinfo.json')][0]);assert meta['id']=='com.mbs.communityhome'
    for k,(m,data) in entries.items():
        if k.endswith('/ha-config.json'):
            assert m.mode==0o600;info['helperCredentialMode']=oct(m.mode);info['helperUid']=m.uid
        if k.endswith(('/detach','/relay')): assert m.mode&0o111
    print(json.dumps(info))

if __name__=='__main__':
    for name in sys.argv[1:]: inspect(name)
