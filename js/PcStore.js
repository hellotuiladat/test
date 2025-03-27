
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function userExists(username) {
    return getUsers().some(u => u.username === username);
}

function register(username, email, password) {
    if (userExists(username)) return false;
    saveUser({ username, email, password });
    return true;
}

function login(username, password) {
    return getUsers().some(u => u.username === username && u.password === password);
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
    updateUI();
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function logout() {
    localStorage.removeItem('currentUser');
    updateUI();
    alert('Đã đăng xuất');
}

// Cart functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    if (!getCurrentUser()) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        $('#loginModal').modal('show');
        return;
    }
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, price: product.price || 10000000 }); // Default price if not provided
    }
    saveCart(cart);
    updateUI();
    alert('Đã thêm vào giỏ hàng!');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateUI();
}

function updateUI() {
    const currentUser = getCurrentUser();
    const navbarAuthArea = document.getElementById('navbarAuthArea');
    const welcomeSection = document.getElementById('welcomeSection');
    const cartContent = document.getElementById('cartContent');
    const checkoutButton = document.getElementById('checkoutButton');

    // Update navbar
    if (navbarAuthArea) {
        if (currentUser) {
            navbarAuthArea.innerHTML = `
                <span class="navbar-text me-2">Xin chào, ${currentUser}</span>
                <button class="btn btn-outline-danger" onclick="logout()">Đăng xuất</button>
            `;
        } else {
            navbarAuthArea.innerHTML = `
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal">Đăng nhập</button>
            `;
        }
    }

    // Update welcome section in home.html
    if (welcomeSection) {
        if (currentUser) {
            welcomeSection.style.display = 'block';
            document.getElementById('welcomeMessage').innerText = `Chào mừng ${currentUser} đến với PC Store!`;
        } else {
            welcomeSection.style.display = 'none';
        }
    }

    // Update cart content in cart.html
    if (cartContent) {
        const cart = getCart();
        if (!currentUser) {
            cartContent.innerHTML = `
                <p class="text-center">Vui lòng đăng nhập để xem giỏ hàng.</p>
                <p class="text-center"><a href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Đăng nhập ngay</a></p>
            `;
        } else if (cart.length === 0) {
            cartContent.innerHTML = `<p class="text-center">Giỏ hàng của bạn đang trống.</p>`;
        } else {
            cartContent.innerHTML = `
                <div class="row">
                    ${cart.map(item => `
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <p class="card-text">Số lượng: ${item.quantity}</p>
                                    <p class="card-text">Giá: ${item.price.toLocaleString('vi-VN')} đ</p>
                                    <button class="btn btn-danger mt-2" onclick="removeFromCart(${item.id})">Xoá khỏi giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Update checkout button in cart.html
    if (checkoutButton) {
        const cart = getCart();
        if (currentUser && cart.length > 0) {
            checkoutButton.innerHTML = `
                <a href="checkout.html" class="btn btn-primary">Xác nhận đặt hàng</a>
            `;
        } else {
            checkoutButton.innerHTML = '';
        }
    }
}

function validateUsername() {
    const username = document.getElementById("ustext").value.trim();
    const errus = document.getElementById("errus");
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(username)) {
        errus.innerText = "Username không được chứa ký tự đặc biệt hoặc dấu cách!";
        return false;
    }
    errus.innerText = "";
    return true;
}

function kiemTraEmail() {
    const email = document.getElementById("mail").value.trim();
    const errmail = document.getElementById("errmail");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errmail.innerText = "Email không hợp lệ!";
        return false;
    }
    errmail.innerText = "";
    return true;
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    usernameError.innerText = '';
    passwordError.innerText = '';

    let isValid = true;
    if (!username) {
        usernameError.innerText = 'Vui lòng nhập username';
        isValid = false;
    }
    if (!password) {
        passwordError.innerText = 'Vui lòng nhập password';
        isValid = false;
    }
    if (!isValid) return;

    if (login(username, password)) {
        setCurrentUser(username);
        $('#loginModal').modal('hide');
        alert('Đăng nhập thành công');
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('ustext').value.trim();
    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('pw').value;
    const confirmPassword = document.getElementById('pwc').value;

    document.getElementById('errus').innerText = '';
    document.getElementById('errmail').innerText = '';
    document.getElementById('errpw').innerText = '';
    document.getElementById('errpwc').innerText = '';

    let isValid = true;
    if (!validateUsername()) isValid = false;
    if (!kiemTraEmail()) isValid = false;
    if (password.length < 6) {
        document.getElementById('errpw').innerText = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById('errpwc').innerText = 'Mật khẩu không khớp';
        isValid = false;
    }
    if (!isValid) return;

    if (register(username, email, password)) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        $('#signupModal').modal('hide');
        $('#loginModal').modal('show');
    } else {
        document.getElementById('errus').innerText = 'Username đã tồn tại';
    }
}