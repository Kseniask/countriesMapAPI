const express = require('express')
const router = express.Router()
const axios = require('axios')
const { parse } = require('svg-parser')
const { _ } = require('lodash')
const uniqueCountryLocators = require('../helpers/countryNamesMapping.json')

// Countries that shouldn't be displayed to user in a list
const reduceCountries = [
  'Aland Islands',
  'Baker Island',
  'Bouvet Island',
  'French Southern and Antarctic Lands',
  'Glorioso Islands',
  'Heard Island and McDonald Islands',
  'Howland Island',
  'Jarvis Island',
  'Johnston Atoll',
  'Juan De Nova Island',
  'Midway Islands',
  'Norfolk Island',
  'Sint Maarten',
  'South Georgia and South Sandwich Islands',
  'Swaziland',
  'Wake Island',
  'Western Sahara'
]

// Get all countries
router.get('/', async (req, res) => {
  try {
    let response = await axios.get(
      'https://www.amcharts.com/lib/3/maps/svg/worldIndiaHigh.svg'
    )
    const parsedSvg = parse(response.data).children[0].children[1].children
    res.status(200).json(parsedSvg)
  } catch (err) {
    res.status(404).json({ message: 'Map not found' })
  }
})

// Get filtered country list
router.get('/list', async (req, res) => {
  try {
    let response = await axios.get(
      'https://www.amcharts.com/lib/3/maps/svg/worldIndiaHigh.svg'
    )
    const parsedSvg = parse(response.data).children[0].children[1].children
    const allCountries = parsedSvg.map(country => country.properties.title)
    const countriesSet = new Set(allCountries)
    reduceCountries.forEach(country => {
      countriesSet.delete(country)
    })
    // Parse Set to array
    res.status(200).send([...countriesSet])
  } catch (err) {
    res
      .status(500)
      .json({ Message: 'Error occured while generating country list' })
  }
})

//Get one
router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name
    const fileNamePrefix = uniqueCountryLocators[name]
      ? uniqueCountryLocators[name]
      : _.camelCase(name.trim())
    const fileName = `${fileNamePrefix}High.svg`
    let response = await axios.get(
      `https://www.amcharts.com/lib/3/maps/svg/${fileName}`
    )
    const parsedSvg = parse(response.data)
    res.status(200).json(parsedSvg.children[0].children[1].children)
  } catch (err) {
    res
      .status(500)
      .json({ Message: 'Error occured while generating country details' })
  }
})
module.exports = router
