
import {test,expect} from '@playwright/test'

test('Monitoring network Requests',async({page})=>{

 page.on('request',request=>{
  console.log('Requests :',request.url(),request.method())
 })

 page.on('response',response=>{
  console.log('responses :',response.url(),response.status())
 })

await page.goto('https://demo.playwright.dev/api-mocking/')
})
