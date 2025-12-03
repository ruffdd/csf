
os.execute('source .venv/bin/activate')
--run project
vim.cmd("term tsc --watch")
vim.cmd("term flask --app frontend.py")
os.execute('xdg-open localhost:5000')
