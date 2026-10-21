import re
path = r'c:\Users\VIREN\Downloads\Sample (3) (2)\Sample\my-app\src\index.css'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '#1f2230': 'var(--bg-primary)',
    '#2c2f42': 'var(--bg-secondary)',
    '#e0e0e0': 'var(--text-primary)',
    '#cfd1d9': 'var(--text-secondary)',
}

for k, v in replacements.items():
    content = re.sub(k, v, content, flags=re.IGNORECASE)

variables = """
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f4f6f8;
  --text-primary: #333333;
  --text-secondary: #666666;
}

[data-theme='dark'] {
  --bg-primary: #1f2230;
  --bg-secondary: #2c2f42;
  --text-primary: #e0e0e0;
  --text-secondary: #cfd1d9;
}

body {
  transition: background-color 0.3s, color 0.3s;
}
"""
content = variables + '\n' + content

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
