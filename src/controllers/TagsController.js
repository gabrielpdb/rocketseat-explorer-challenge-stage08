const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class TagsController {
  /* async create(req, res) {
    const { name, email, password, avatar } = req.body

    if (!name) {
      throw new AppError('O nome é obrigatório!')
    }
    if (!email) {
      throw new AppError('O email é obrigatório!')
    }
    if (!password) {
      throw new AppError('A senha é obrigatória!')
    }

    const checkIfEmailAlreadyExists = await knex('users')
      .where({ email })
      .first()

    if (checkIfEmailAlreadyExists) {
      throw new AppError('Este e-mail já está em uso')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: hashedPassword,
      avatar
    })

    res.status(201).json({ name, email, password, avatar })
  }

  async update(req, res) {
    const { name, email, password, old_password, avatar } = req.body
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado!')
    }

    const userAlreadyUsingUpdatedEmail = await knex('users')
      .where({ email })
      .first()

    if (
      userAlreadyUsingUpdatedEmail &&
      userAlreadyUsingUpdatedEmail.id !== user.id
    ) {
      throw new AppError('Este e-mail já está em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError('Informe a senha antiga para definir a nova senha!')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere!')
      }

      user.password = await hash(password, 8)
    }

    await knex('users')
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now()
      })
      .where({ id })

    res.json()
  } */
}

module.exports = TagsController
