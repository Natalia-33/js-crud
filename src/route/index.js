// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  // Статичне приватне поле для зберігання списку об'єктів Track

  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичний метод для створення об'єкту Track і додавання його до списку #list

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  // static getById() {
  //   return this.#list.reverse()
  // }
}

Track.create(
  'Інь Ян',
  'Monatik і Roxolana',
  'https://picsum.photos/100/100',
)

Track.create(
  'Baila Conmigo(Remix)',
  'Selena Gomez',
  'https://picsum.photos/100/100',
)

Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)

Track.create(
  'DAKTTI',
  'BAD BUNNY і JHAY',
  'https://picsum.photos/100/100',
)

Track.create(
  '11 pm',
  'Maluma',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  // Статичне приватне поле для зберігання списку об'єктів Playlist

  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  // Статичний метод для створення об'єкту Playlist і додавання його до списку #list

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(Playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => -Math.random())
      .slice(0, 3)

    Playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase(value)),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test'))
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      image: playlist.image,
    },
  })
})

router.get('spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlist.id}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router

router.get('spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  const allTracks = Track.getList()

  console.log(playlistId, playlist, allTracks)

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
      // link: '/spotify-track-add?playlist={{playlistId}}&trackId=={{id}}',
    },
  })
})

// ====================================================================

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: '/spotify-track-add?playlistId=${playlist}',
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.lamp(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = ''
  const list = findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.lamp(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
