const { hash, compare } = require('bcryptjs')
const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class NotesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body
    const { user_id } = req.params

    if (typeof rating !== 'number') {
      throw new AppError('Formato da avaliação é diferente de número')
    }

    if (rating > 5 || rating < 1) {
      throw new AppError('Valor de avaliação inválido')
    }

    const note = {
      title,
      description,
      rating,
      user_id
    }

    const [note_id] = await knex('notes').insert(note)

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex('tags').insert(tagsInsert)

    return res.json()
  }

  async update(req, res) {
    const { title, description, rating, tags } = req.body
    const { id } = req.params

    const note = await knex('notes').where({ id }).first()

    if (!note) {
      throw new AppError('Nota não encontrada')
    }

    if (typeof rating !== 'number') {
      throw new AppError('Formato da avaliação é diferente de número')
    }

    if (rating > 5 || rating < 1) {
      throw new AppError('Valor de avaliação inválido')
    }

    await knex('notes')
      .where({ id })
      .update({
        title: title ?? note.title,
        description: description ?? note.description,
        rating: rating ?? note.rating,
        updated_at: knex.fn.now()
      })

    await knex('tags').where({ note_id: id }).delete()

    const tagsInsert = tags.map(name => {
      return {
        note_id: id,
        name,
        user_id: note.user_id
      }
    })

    await knex('tags').insert(tagsInsert)

    return res.json()
  }

  async index(req, res) {
    const { title, tags, user_id } = req.query

    let notes

    if (title && tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex('tags')
        .select([
          'notes.id',
          'notes.title',
          'notes.description',
          'notes.rating',
          'notes.user_id'
        ])
        .where('notes.user_id', user_id)
        .whereIn('tags.name', filterTags)
        .whereLike('title', `%${title}%`)
        .innerJoin('notes', 'notes.id', 'tags.note_id')
        .orderBy('notes.id')
    } else if (title) {
      notes = await knex('notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
    } else if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex('tags')
        .select([
          'notes.id',
          'notes.title',
          'notes.description',
          'notes.rating',
          'notes.user_id'
        ])
        .where('notes.user_id', user_id)
        .whereIn('tags.name', filterTags)
        .innerJoin('notes', 'notes.id', 'tags.note_id')
        .orderBy('notes.id')
    } else {
      notes = await knex('notes').where({ user_id })
    }

    const newNotes = notes.map(async note => {
      const tags = await knex('tags').where({ note_id: note.id })

      const tagsPromise = await Promise.all(tags)

      return {
        ...note,
        tags: tagsPromise
      }
    })

    const notesPromise = await Promise.all(newNotes)

    return res.json(notesPromise)
  }

  /* async show(req, res) {
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    return res.json(user)
  } */

  /* async delete(req, res) {
    const { id } = req.params

    await knex('users').where({ id }).delete()

    return res.json()
  } */
}

module.exports = NotesController
