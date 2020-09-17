import express from 'express'
import axios from "axios"
import uri from './uri'

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Add POST - /api/login
// router.post('/login', (req, res) => {
//     let customer = null
//     axios
//     .post(uri.login, {params: {username: req.body.username,password: req.body.password}}, { headers: { "Content-Type": "application/json" } })
//     .then(response => {
//         if(!response.data.customer){
//             customer = response.data.customer
//         }
//     })
//     .catch(error => {
//       console.log(error);
//     })
//     .finally(() => {
//         if(customer){
//             req.session.authUser = customer
//             return res.json(customer)
//         }else{
//             res.status(401).json({ message: 'Bad credentials' })
//         }
//     });
// })

// router.get('/principal', (req, res) => {
//     console.log('principal', req.session.authUser)
//     if (req.session && req.session.authUser) {
//         return res.json(req.session.authUser)
//     } 
//     return res.json(null)   
// })

// // Add POST - /api/logout
// router.post('/logout', (req, res) => {
//   delete req.session.authUser
//   res.json({ ok: true })
// })

// // Export the server middleware
// export default {
//   path: '/api',
//   handler: router
// }
