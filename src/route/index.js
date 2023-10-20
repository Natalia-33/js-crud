// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = this.password === this.password
  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) => {
    this.#list.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, { email }) => {
    const user = this.getById(id)

    if (user) {
      if (email) {
        user.email = email
      }
      return true
    } else {
      return false
    }
  }
  static update(user, { email }) {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list: User.getList(),
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ======================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.body

  User.getById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// =====================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  console.log(email, password, id)
  // let result = false

  const user = User.updateById(Number(id), email)

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }
  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})
// Підключаємо роутер до бек-енду

// =====================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()
  res.render('product-create', {
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ===============================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())
  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар успішно додано',
  })

  // ↑↑ сюди вводимо JSON дані
})

module.exports = router
