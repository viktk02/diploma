from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit


ALLOWED_TAGS = {
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li',
    'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'figure',
    'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span',
    'sup', 'sub', 'code', 'pre', 'hr', 'oembed', 'section',
}

VOID_TAGS = {'br', 'img', 'hr'}
DROP_CONTENT_TAGS = {'script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'svg', 'math'}

ALLOWED_ATTRS = {
    'a': {'href', 'title', 'target', 'rel', 'class'},
    'img': {'src', 'alt', 'title', 'width', 'height', 'class'},
    'figure': {'class'},
    'figcaption': {'class'},
    'table': {'class'},
    'th': {'colspan', 'rowspan', 'scope', 'class'},
    'td': {'colspan', 'rowspan', 'scope', 'class'},
    'div': {'class'},
    'span': {'class'},
    'p': {'class'},
    'code': {'class'},
    'pre': {'class'},
    'blockquote': {'class'},
    'oembed': {'url'},
    'section': {'class'},
}


def _is_safe_url(value: str, allow_relative: bool = True) -> bool:
    value = value.strip()
    if not value:
        return False
    if allow_relative and value.startswith(('/', '#', '?')):
        return True
    parts = urlsplit(value)
    return parts.scheme in {'http', 'https', 'mailto', 'tel'}


def _clean_attr(tag: str, attr: str, value: str):
    if attr.startswith('on'):
        return None
    if attr not in ALLOWED_ATTRS.get(tag, set()) and attr not in {'class'}:
        return None

    value = value.strip()
    if not value:
        return None

    if attr in {'href', 'src', 'url'} and not _is_safe_url(value, allow_relative=True):
        return None

    if attr == 'target' and value not in {'_blank', '_self', '_parent', '_top'}:
        return None

    if attr == 'rel':
        rel_values = [part for part in value.split() if part]
        if not rel_values:
            return None
        value = ' '.join(dict.fromkeys(rel_values))

    return attr, escape(value, quote=True)


class _SanitizingHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.parts: list[str] = []
        self.drop_depth = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in DROP_CONTENT_TAGS:
            self.drop_depth += 1
            return

        if self.drop_depth > 0:
            return

        if tag not in ALLOWED_TAGS:
            return

        cleaned_attrs = []
        for attr, value in attrs:
            attr = attr.lower()
            cleaned = _clean_attr(tag, attr, value or '')
            if cleaned:
                cleaned_attrs.append(cleaned)

        if tag == 'a':
            has_target_blank = any(attr == 'target' and value == '_blank' for attr, value in cleaned_attrs)
            if has_target_blank and not any(attr == 'rel' for attr, _ in cleaned_attrs):
                cleaned_attrs.append(('rel', 'noopener noreferrer'))

        rendered_attrs = ''.join(f' {name}="{value}"' for name, value in cleaned_attrs)
        if tag in VOID_TAGS:
            self.parts.append(f'<{tag}{rendered_attrs}>')
        else:
            self.parts.append(f'<{tag}{rendered_attrs}>')

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in DROP_CONTENT_TAGS:
            if self.drop_depth > 0:
                self.drop_depth -= 1
            return

        if self.drop_depth > 0 or tag not in ALLOWED_TAGS or tag in VOID_TAGS:
            return

        self.parts.append(f'</{tag}>')

    def handle_data(self, data):
        if self.drop_depth > 0:
            return
        self.parts.append(escape(data, quote=False))

    def handle_entityref(self, name):
        if self.drop_depth > 0:
            return
        self.parts.append(f'&{name};')

    def handle_charref(self, name):
        if self.drop_depth > 0:
            return
        self.parts.append(f'&#{name};')

    def handle_comment(self, data):
        return


def sanitize_html(value: str | None) -> str:
    if not value:
        return ''
    parser = _SanitizingHTMLParser()
    parser.feed(value)
    parser.close()
    return ''.join(parser.parts)