/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";

window.alert = jest.fn();

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ... message icon in vertical layout should be highlighted", async () => {
  
      Object.defineProperty(window, 'localStorage', { value: localStorageMock } )
      window.localStorage.setItem('user', JSON.stringify( { type: 'Employee' } ))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => screen.getByTestId('icon-mail'))     
      const mailIcon = screen.getByTestId('icon-mail')

      // await waitFor(() => screen.getByTestId('btn-new-bill'))
      // const newBillButton = await screen.getByTestId('btn-new-bill')
      
      // await waitFor(() => screen.getByText('Mes notes de frais'))
      // const newBillText = await screen.getAllByText('Mes notes de frais')
      
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy()
      // expect (newBillButton).toBeTruthy()
      // expect (newBillText).toBeTruthy()


    })
  
  })

  describe("When I am on NewBill Page", () => {
    test("Then the message'Envoyer une note de frais' should be displayed", async () => {
  
      const html = NewBillUI()
      document.body.innerHTML = html
         
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })  
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
     
    })
    
  })

  describe('When I provide a picture as proof of invoice', () => {
    test("then it should have been loaded in the input without any error message", () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
      //*********************************************** */
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES( { pathname } )}     
      //*********************************************** */
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const NewBillController = new NewBill( { document, onNavigate, store: null, localStorage: window.localStorage } )
      // ======================================
      // error message
      const errorMessage = jest.fn(window.alert('Invalid file type'));  
      // ======================================
      // input file
      const file = new File(['dummy content'], 'example.jpg', {type: 'image/jpg'})
      const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)
         
      const inputFile = screen.getByTestId('file')
      Object.defineProperty(inputFile, 'files', { value: [file] })

      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile)
      //********************************************************* */

      


      //********************************************************* */
      expect(handleChangeFile).toHaveBeenCalled()     
      expect(inputFile.files[0].name).toBe('example.jpg')      
      expect(errorMessage).not.toHaveBeenCalled();
      expect(errorMessage).not.toHaveBeenCalledWith('Invalid file type');
      
    })
    test("then new data should be created", () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
      //*********************************************** */
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES( { pathname } )}     
      //*********************************************** */
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const NewBillController = new NewBill( { document, onNavigate, store: null, localStorage: window.localStorage } )
      // ======================================
      // error message
      const errorMessage = jest.fn(window.alert('Invalid file type'));  
      // ======================================
      // input file
      const file = new File(['dummy content'], 'example.jpg', {type: 'image/jpg'})
      const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)
         
      const inputFile = screen.getByTestId('file')
      Object.defineProperty(inputFile, 'files', { value: [file] })

      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile)
      //********************************************************* */

      


      //********************************************************* */
      expect(handleChangeFile).toHaveBeenCalled()     
      expect(inputFile.files[0].name).toBe('example.jpg')      
      expect(errorMessage).not.toHaveBeenCalled();
      expect(errorMessage).not.toHaveBeenCalledWith('Invalid file type');
      
    })
  
  })
  
  describe('When I provide a non-picture as proof of invoice', () => {
    test("then an error-message should appear ", () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
      
      // const onNavigate = (pathname) => { document.body.innerHTML = ROUTES( { pathname } )}     
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const NewBillController = new NewBill( { document, onNavigate, store: null, localStorage: window.localStorage } )
          
      // input file
      const file = new File(['dummy content'], 'example.pdf', {type: 'text/pdf'})
      const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)
      // window.alert = jest.fn();
  
      const inputFile = screen.getByTestId('file')
      Object.defineProperty(inputFile, 'files', { value: [file] })
  
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile)  

      expect(handleChangeFile).toHaveBeenCalled()     
      expect(inputFile.files[0].name).toBe('example.pdf') 
      expect(window.alert).toHaveBeenCalled();
      expect(window.alert).toBeCalledWith('Invalid file type');
    })
  
  })

  describe('When I provide commentary', () => {
    test("then it should have been loaded in the input ", () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
         
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      
      const inputCommentary = screen.getByTestId('commentary')
      fireEvent.change(inputCommentary, { target: { value: 'Hello' } })  

      expect(inputCommentary.value).toBe('Hello')
     
    })
  
  })  
  
  describe('When I am submitting a bill', () => {
    test("My form should be submitted...", () => {
      // On fabrique la page
      const html = NewBillUI()
      document.body.innerHTML = html
    
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })} 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })  
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const NewBillController = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })

      const newBillForm = document.querySelector(`form`)
      const updateBill = jest.fn(NewBillController.updateBill)

      newBillForm.addEventListener("submit", updateBill)
      newBillForm.submit()

      const newBillButton = screen.getByTestId('btn-new-bill')
      
      expect(updateBill).toHaveBeenCalled() 
      // On verifie qu on est bien revenu sur la page newbill     
      expect (newBillButton).toBeTruthy()
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })

})



 



  


