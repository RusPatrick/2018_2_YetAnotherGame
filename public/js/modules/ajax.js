(function () {
    const noop = () => null;

    class AjaxModule {
        _ajax({callback = noop, method = 'GET', path = '/', body} = {}) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, path, true);
            xhr.withCredentials = true;

            if (body) {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }

                callback(xhr);
            };

            if (body) {
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }
        }

        doGet (params = {}) {
			this._ajax({...params, method: 'GET'});
		}

		doPost (params = {}) {
			this._ajax({...params, method: 'POST'});
		}
    }

    window.AjaxModule = new AjaxModule();
})();
