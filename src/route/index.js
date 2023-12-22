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

  static getById() {
    return this.#list.reverse()
  }
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

class PlayList {
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
    const newPlayList = new PlayList(name)
    this.#list.push(newPlayList)
    return newPlayList
  }

  // Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(PlayList) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    PlayList.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      PlayList.#list.find(
        (playList) => playList.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playList) =>
      playList.name
        .toLowerCase()
        .includes(name.toLowerCase(value)),
    )
  }
}

PlayList.makeMix(PlayList.create('Test'))
PlayList.makeMix(PlayList.create('Test'))
PlayList.makeMix(PlayList.create('Test'))
// =========================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = ''
  const list = PlayList.findListByValue(value)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-library', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-library',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ==========================================================================
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
// ==========================================================
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

  const playList = PlayList.create(name)

  if (isMix) {
    PlayList.makeMix(playList)
  }

  console.log(playList)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})
// =============================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playList = PlayList.getById(id)

  if (!playList) {
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
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})
// ======================================================
router.get('/spotify-track-delete', function (req, res) {
  const playListId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playList = PlayList.getById(playListId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playList?id=${playList.id}`,
      },
    })
  }

  playList.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})
// =======================================================================
router.get('/spotify-track-add', function (req, res) {
  const playListId = Number(req.query.playListId)
  const playList = PlayList.getById(playListId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playList?id=${playListId}`,
      },
    })
  }
  // const allTracks = Track.getList()

  // console.log(playListId, playList, allTracks)

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playListId: playList.id,
      tracks: Track.getList(),
      // link: '/spotify-track-add?playList={{playListId}}&trackId=={{id}}',
      name: playList.name,
    },
  })
})

// ====================================================================

router.post('/spotify-track-add', function (req, res) {
  const playListId = Number(req.body.playListId)
  const trackId = Number(req.body.trackId)

  console.log(playListId, trackId)

  const playList = PlayList.getById(playListId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playList?id=${playListId}`,
      },
    })
  }
  const trackToAdd = Track.getById(trackId)

  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: '/spotify-track-add?playListId=${playListId}',
      },
    })
  }

  playList.addTrack(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})
// ====================================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = PlayList.findListByValue(value)

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
  const value = 'req.body.value ||'
  const list = PlayList.findListByValue(value)

  console.log(value)

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
// Підключаємо роутер до бек-енду
module.exports = router
