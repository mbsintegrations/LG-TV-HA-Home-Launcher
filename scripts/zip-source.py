import json, pathlib, sys, zipfile
root = pathlib.Path(sys.argv[1]).resolve()
files = json.loads(pathlib.Path(sys.argv[2]).read_text())
with zipfile.ZipFile(sys.argv[3], 'w', zipfile.ZIP_DEFLATED) as z:
    for name in files:
        p = (root / name).resolve()
        if not p.is_relative_to(root) or any(part in ('private','node_modules','.build','evidence') for part in p.relative_to(root).parts):
            raise ValueError('Non-public source path')
        z.write(p, 'LG-Home-Launcher/' + name)
print('Credential-free source archive created.')
