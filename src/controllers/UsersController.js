const { hash, compare } = require('bcryptjs')
const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class UsersController {
  async create(req, res) {
    const { name, email, password, avatar } = req.body

    const userExists = await knex('users').where({ email }).first()

    if (userExists) {
      throw new AppError('Email já cadastrado')
    }

    const hashPassword = await hash(password, 8)

    const user = { name, email, password: hashPassword, avatar }

    const [user_id] = await knex('users').insert(user)

    return res.json(user_id)
  }

  async update(req, res) {
    const { name, email, avatar, old_password, new_password } = req.body
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (new_password && !old_password) {
      throw new AppError('Informe a senha antiga para definir nova senha')
    }

    if (new_password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(new_password, 8)
    }

    await knex('users').where({ id }).update(user)

    return res.json()
  }

  async index(req, res) {
    const users = await knex('users')

    return res.json(users)
  }

  async show(req, res) {
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    return res.json(user)
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('users').where({ id }).delete()

    return res.json()
  }
}

module.exports = UsersController
