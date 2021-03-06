"use strict"

const AJAX = window.AjaxModule

const Block = window.Block
const Form = window.Form
const Scoreboard = window.Scoreboard
const Profile = window.Profile

const signIn = window.signInFields
const signUp = window.signUpFields
const update = window.updateFields

// const server = "https://backend-yag.now.sh"
const server = ""

let offset = -2
const DEFOFF = 2
const DEFLIM = 2


let user =
AJAX.doGet({
	callback(xhr) {
		xhr.responseText !== "" ? JSON.parse(xhr.responseText) : {}
	},
	path: server+"/me",
})

const game = new Block(document.getElementById("game"))

/**
 * Создание ссылки "Back to main menu" для возврата в главное меню
 */
function createMenuLink() {
	const menuLink = Block.Create("a", {"href": "menu", "data-href": "menu"}, [], "Back to main menu")
	return menuLink
}

/**
 * Создание шапки с регистрацией, логином и выходом
 */
function createMenu() {
	const menuSection = Block.Create("section", {"data-section-name": "menu", "id": "mainMenu"}, [])
	const header = Block.Create("div", {"id": "header"}, [])
	const logo = Block.Create("div", {"id": "logo"}, [])
	const logoHeader = Block.Create("h1", {}, [], "Yet Another Game")

	logo.append(logoHeader)

	const main = Block.Create("div", {"id": "main"}, [])
	const mainInner = Block.Create("div", {}, [])

	main.append(mainInner)

	const register = {
		sign_in: Block.Create("a", {"href": "sign_in", "data-href": "sign_in"}, ["header-button"], "Sign in"),
		sign_up: Block.Create("a", {"href": "sign_up", "data-href": "sign_up"}, ["header-button"], "Sign up"),
		log_out: Block.Create("a", {"href": "log_out", "data-href": "log_out"}, ["header-button"], "Log out"),
		profile: Block.Create("a", {"href": "me", "data-href": "me"}, ["header-button"]),
	}

	const titles = {
		new_game: Block.Create("a", {"href": "new_game", "data-href": "new_game"}, ["menu-button"], "New Game"),
		leaders: Block.Create("a", {"href": "leaders", "data-href": "leaders"}, ["menu-button"], "Scoreboard"),
		me: Block.Create("a", {"href": "me", "data-href": "me"}, ["menu-button"], "Profile"),
		update: Block.Create("a", {"href": "update", "data-href": "update"}, ["menu-button"], "Update"),
	}

	if (user === undefined) {
		header
			.append(register.sign_up)
			.append(register.sign_in)
	} else {
		register.profile.setText(`${user.username}`)
		header
			.append(register.log_out)
			.append(register.profile)
	}

	Object.entries(titles).forEach(function (elem) {
		mainInner.append(elem[1])
	})

	menuSection
		.append(header)
		.append(logo)
		.append(main)

	game.append(menuSection)
}

/**
 * Создание страницы входа в учетную запись пользователя
 */
function createSignIn() {

    const signInSection = Block.Create('section', {'data-section-name': 'sign_in'}, []);
    const header = Block.Create('h1', {}, [], 'Sign In');

    const form = new Form(signIn);

    signInSection
        .append(header)
        .append(createMenuLink())
        .append(form)

    form.onSubmit(
        function (formdata) {
            if (formdata.password.value.length < 4) {
                if (document.getElementById('err') !== null) {
                    const el = document.getElementById('err');
                    el.parentNode.removeChild(el)
                }

                const err = Block.Create('div', {'id': 'err'}, []);
                form.append(err);

                const att = Block.Create('p', {}, [], 'password must be at least 4 characters');
                err.append(att);

                return;
            }

            AJAX.doPost({
                callback(xhr) {
                    game.clear();
                    createProfile();
                },
                path: server+'/login',
                body: {
                    email: formdata.email.value,
                    password: formdata.password.value,
                },
            });
        }
    );

    game.append(signInSection);
}

/**
 * Создание формы регистрации нового пользователя
 */
function createSignUp() {

    const signUpSection = Block.Create('section', {'data-section-name': 'sign_up'}, []);
    const header = Block.Create('h1', {}, [], 'Sign Up');

    const form = new Form(signUp);

    signUpSection
        .append(header)
        .append(createMenuLink())
        .append(form);

    form.onSubmit(
        function (formdata) {
            const email = formdata.email.value;
            const username = formdata.username.value;
            const first_name = formdata.first_name.value;
            const last_name = formdata.last_name.value;
            const password = formdata.password.value;
            const password_repeat = formdata.password_repeat.value;

            if (password.length < 4) {
                if (document.getElementById('err') !== null) {
                    const el = document.getElementById('err');
                    el.parentNode.removeChild(el)
                }

                const err = Block.Create('div', {'id': 'err'}, []);
                form.append(err);

                const att = Block.Create('p', {}, [], 'password must be at least 4 characters');
                err.append(att);

                return;
            }

            if (password !== password_repeat) {
                alert('Passwords is not equals');
                return;
            }

            AJAX.doPost({
                callback(xhr) {
                    game.clear();
                    createProfile();
                },
                path: server+'/signup',
                body: {
                    email: email,
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    password: password,
                },
            });
        }
    );

    game.append(signUpSection);

}

/**
 * Выход из учетной записи
 */
function createLogOut() {
    AJAX.doPost({
        callback(xhr) {
            game.clear();
            user = undefined;
            createMenu();
        },
        path: server+'/logout',
        body: {},
    });
}

/**
 * Обновление данных учетной записи
 */
function createUpdate() {
    if (user === undefined) {
        AJAX.doGet({
            callback(xhr) {
                if (!xhr.responseText) {
                    alert('Unauthorized');
                    game.clear();
                    createMenu();
                    return;
                }
                user = JSON.parse(xhr.responseText);
                game.clear();
            },
            path: server+'/me',
        });
        return;
    }

    const updateSection = Block.Create('section', {'data-section-name': 'update'}, []);
    const header = Block.Create('h1', {}, [], 'Update');

    const form = new Form(update);

    form.setAttribute({'id': 'myForm', 'name': 'myForm', 'enctype': 'multipart/form-data', 'method': 'POST'});

    updateSection
        .append(header)
        .append(createMenuLink())
        .append(form);

    form.onSubmit(
        function (formdata) {
            const formData = new FormData(document.forms.myForm);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload', true);
            xhr.onload = xhr.onerror = function() {
                if (this.status == 200) {
                    console.log("success");
                } else {
                    console.log("error " + this.status);
                }
            }
            xhr.send(formData);

            AJAX.doPost({
    			callback(xhr) {
                    game.clear();
                    createProfile();
    			},
    			path: server+'/update',
                body: {
                    email: formdata.email.value,
                    username: formdata.username.value,
                    first_name: formdata.first_name.value,
                    last_name: formdata.last_name.value,
                }
    		});
        }
    );

    game.append(updateSection);

}

/**
 * Создание страницы профиля
 * @param {*} me Объект пользователя
 */
function createProfile(me) {
    const profileSection = Block.Create('section', {'data-section-name': 'profile'}, []);
    const header = Block.Create('h1', {}, [], 'Profile');

    profileSection
        .append(header)
        .append(createMenuLink());

    if (me) {
        const p = Block.Create('p', {}, []);

        const email = Block.Create('div', {}, [], `Email ${me.email}`);
        const username = Block.Create('div', {}, [], `Username ${me.username}`);
        const first_name = Block.Create('div', {}, [], `First Name ${me.first_name}`);
        const last_name = Block.Create('div', {}, [], `Last Name ${me.last_name}`);
        const score = Block.Create('div', {}, [], `Score ${me.score}`);

        const avatar = Block.Create('img', {}, []);
        if (me.avatar) {
            avatar.setAttribute({'src': `${me.avatar}`});
        } else {
            avatar.setAttribute({'src': `../uploads/defaultpic.jpeg`});
        }

        p
            .append(email)
            .append(username)
            .append(first_name)
            .append(last_name)
            .append(score)
            .append(avatar);

        profileSection.append(p);
    } else {
        AJAX.doGet({
            callback(xhr) {
                if (!xhr.responseText) {
                    alert('Unauthorized');
                    game.clear();
                    createMenu();
                    return;
                }
                /*const*/ user = JSON.parse(xhr.responseText);
                game.clear();
                createProfile(user);
            },
            path: server+'/me',
        });
    }
    game.append(profileSection);
}

/**
 * Создание доски лидеров
 * @param {Object} users Объекты пользователей
 * @param {number} offset Количество пользователей на странице
 * @param {number} limit Количество пользователей всего
 */
function createScoreboard(users, offset, limit) {
	// debugger
	const scoreboardSection = Block.Create("section", {"data-section-name": "scoreboard"}, [])
	const header = Block.Create("h1", {}, [], "Leaders")

	const tableWrapper = Block.Create("div", {}, [])

	scoreboardSection
		.append(header)
		.append(createMenuLink())
		.append(Block.Create("br", {}, []))
		.append(tableWrapper)

	if (users) {
		const scoreboard = new Scoreboard({el: tableWrapper})
		scoreboard.data = users.slice(0,users.length-1)
		// debugger;
		scoreboard.render()
        
		let a = Block.Create("input", {"id": "btn1", "type": "button", "value": "<-", "onclick": "negpaginate()"}, [], "kek")
		let a2 = Block.Create("input", {"id": "btn2", "type": "button", "value": "->", "onclick": "paginate()"}, [], "kek")

		header
			.append(a)
			.append(a2)

		game.append(scoreboardSection)
        

	} else {
		scoreboardSection.append(Block.Create("em", {}, [], "Loading"))

		AJAX.doGet({
			callback(xhr) {
				const users = JSON.parse(xhr.responseText)

				const el2 = document.getElementById("btn2")
				const el = document.getElementById("btn1")
				let lim = users[2]
				if (lim===undefined)
				{
					lim=6
				}


				if (offset === lim && el2 !== null) {
					el2.disabled = true
				} else if (offset < 0) {
					el.disabled = true
				} else {
					if (el !== null || el2 !== null) {
						el.disabled = false
						el2.disabled = false
					}
					game.clear()

					createScoreboard(users, offset)
				}
			},
			path: server+`/leaders?offset=${offset}&limit=${limit}`,
		})
	}
}

function negpaginate(users) {
	const limit = DEFLIM
	offset -= DEFOFF
	createScoreboard(users, offset, limit)
}

/**
 * Создание пагинации 
 * @param {Object} users список пользователей
 */
function paginate(users) {
	// debugger
	const limit = DEFLIM
	offset += DEFOFF
	createScoreboard(users, offset, limit)
}

const pages = {
	menu: createMenu,
	sign_in: createSignIn,
	sign_up: createSignUp,
	log_out: createLogOut,
	leaders: paginate,
	me: createProfile,
	update: createUpdate
}

createMenu()

game.on("click", function (event) {
	if (!(event.target instanceof HTMLAnchorElement)) {
		return
	}

	event.preventDefault()
	const link = event.target
	game.clear()
	pages[link.dataset.href]()
})
