# stubs


def html(s: str):
    return s


def _(s: str):
    return s


def e(s: str):
    return s


class SafeStr(str):
    pass


def Dialog(*, post_url: str, title: str, body: SafeStr, ok_text: str | None = None):
    ok_text = ok_text or _("Ok")

    return html(
        f"""
        <div class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-md modal-dialog-centered">
                <form class="form modal-content"
                    autocomplete="off"
                    hx-post="{ post_url }"
                    hx-select=".modal-content"
                    hx-swap="outerHTML">
                    <div class="modal-header">
                        <h5 class="modal-title">{ e(title) }</h5>
                    </div>
                    <div class="modal-body">
                        { body }
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">
                            { e(ok_text) }
                        </button>
                    </div>
                </form>
            </div>
        </div>"""
    )
