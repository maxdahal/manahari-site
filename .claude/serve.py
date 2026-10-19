"""Local preview with clean URLs, like the live site on Vercel
(vercel.json: cleanUrls). /about serves about.html, and /about.html
redirects to /about. Run: python3 .claude/serve.py [port]"""
import http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        if path.endswith(".html"):
            clean = path[: -len(".html")]
            clean = "/" if clean.endswith("/index") else clean
            self.send_response(308)
            self.send_header("Location", clean + ("?" + query if query else ""))
            self.end_headers()
            return
        local = os.path.join(ROOT, path.lstrip("/"))
        if path != "/" and not os.path.splitext(path)[1] and os.path.isfile(local + ".html"):
            self.path = path + ".html" + ("?" + query if query else "")
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
