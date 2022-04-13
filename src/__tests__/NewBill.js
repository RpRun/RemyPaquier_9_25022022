/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen, waitFor } from "@testing-library/dom"
 import userEvent from "@testing-library/user-event"
 import NewBillUI from "../views/NewBillUI.js"
 import BillsUI from "../views/BillsUI.js"
 import NewBill from "../containers/NewBill.js"
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import router from "../app/Router.js";
 import mockStore from "../__mocks__/store"

 
 window.alert = jest.fn();
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     test("Then message icon in vertical layout should be highlighted", async () => {
   
       Object.defineProperty(window, 'localStorage', { value: localStorageMock } )
       window.localStorage.setItem('user', JSON.stringify( { type: 'Employee' } ))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.NewBill)
 
       await waitFor(() => screen.getByTestId('icon-mail'))     
       const mailIcon = screen.getByTestId('icon-mail')
 
       expect(mailIcon.classList.contains('active-icon')).toBeTruthy()     
              
     })

     test("Then the title 'Envoyer une note de frais' should be displayed", async () => {
   
      const html = NewBillUI()
      document.body.innerHTML = html         
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })  
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      await waitFor(() => screen.getByText('Envoyer une note de frais'))
      const sendBillText = screen.getAllByText('Envoyer une note de frais')

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
      expect(sendBillText).toBeTruthy()
     
    })
   
   })
 
   describe('When I provide a picture as proof of invoice', () => {
     test("then it should have been loaded in the input without any error message", () => {
       
       const html = NewBillUI()
       document.body.innerHTML = html       
       const onNavigate = (pathname) => { document.body.innerHTML = ROUTES( { pathname } )}           
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
       window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
 
       const NewBillController = new NewBill( { document, onNavigate, store: null, localStorage: window.localStorage } )     
       
      // input file
       const file = new File(['dummy content'], 'example.jpg', {type: 'image/jpg'})
       const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)  
       const inputFile = screen.getByTestId('file')
       Object.defineProperty(inputFile, 'files', { value: [file] })
      // ======================================
        
      // error message
       const errorMessage = jest.fn(window.alert('Invalid file type'));  
      // ======================================
       inputFile.addEventListener("change", handleChangeFile)
       fireEvent.change(inputFile)
    
       expect(handleChangeFile).toHaveBeenCalled() 
       expect(inputFile.files[0].name).toBe('example.jpg')      
       expect(errorMessage).not.toHaveBeenCalled();
      
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
       const file = new File(['test file'], 'example.pdf', {type: 'text/pdf'})
       const handleChangeFile  = jest.fn(NewBillController.handleChangeFile) 
       const inputFile = screen.getByTestId('file')
       Object.defineProperty(inputFile, 'files', { value: [file] })
   
       inputFile.addEventListener("change", handleChangeFile)
       fireEvent.change(inputFile)  
      //  console.log(file.type)

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
     test("My form should be submitted and i should be sent to bills page", () => {
       // On fabrique la page
       const html = NewBillUI()
       document.body.innerHTML = html    
       const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })} 
       // localStorageMock necessaire?
       // Object.defineProperty(window, 'localStorage', { value: localStorageMock })  
       window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
 
       const NewBillController = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
 
       const newBillForm = screen.getByTestId('form-new-bill')
       const updateBill = jest.fn(NewBillController.updateBill)
 
       newBillForm.addEventListener("submit", updateBill)
       newBillForm.submit()

       expect(updateBill).toHaveBeenCalled()
 
       const newBillButton = screen.getByTestId('btn-new-bill')

       // On verifie qu on est bien revenu sur la page newbill     
       expect(newBillButton).toBeTruthy()
       expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
     })
   })
 
 })

 //test d'intégration POST
describe('Given I am a user connected as Employee', () => {
  jest.spyOn(mockStore, 'bills')
  describe('When I post a new bill', () => {
    test('Then I should be send to the Bills page', () => {
      // Creation de la page
      const html = NewBillUI()
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      const newBillTest = new NewBill({ 
        document, onNavigate, store: null, localStorage: window.localStorage,
      })

      // Facture à soumettre
      const billToPost = {
        type: 'Transports',
        name: 'Test',
        date: '2022-04-08',
        amount: 80,
        vat: 20,
        pct: 10,
        commentary: 'Test',
        fileUrl: 'https://picsum.photos/id/1/200/300',
        fileName: 'bill-train.jpg',
        status: 'pending',
      }

      // On remplit les champs du formulaire
      screen.getByTestId('expense-type').value = billToPost.type
      screen.getByTestId('expense-name').value = billToPost.name
      screen.getByTestId('datepicker').value = billToPost.date
      screen.getByTestId('amount').value = billToPost.amount
      screen.getByTestId('vat').value = billToPost.vat
      screen.getByTestId('pct').value = billToPost.pct
      screen.getByTestId('commentary').value = billToPost.commentary

      newBillTest.fileName = billToPost.fileName
      newBillTest.fileUrl = billToPost.fileUrl

      // On mocke les 2 fonctions necessaires pour soumettre la facture
      newBillTest.updateBill = jest.fn()
      const handleSubmit = jest.fn((e) => newBillTest.handleSubmit(e))

      // On selectionne le formulaire
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)

      const sendBillButton = screen.getByText('Envoyer')
      
      // On soumet le formulaire avec le bouton type submit
      userEvent.click(sendBillButton)

      expect(handleSubmit).toHaveBeenCalled()
      expect(newBillTest.updateBill).toHaveBeenCalled()

    })

    // Erreur 404 
    describe('When an error occurs on API', () => {
      test('create bills from an API and fails with 404 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error('Erreur 404'))
            },
          }
        })
        const html = BillsUI({ error: 'Erreur 404' })
        document.body.innerHTML = html
        await new Promise(process.nextTick)
        const errorMessage = await screen.getByText(/Erreur 404/)
        expect(errorMessage).toBeTruthy()
      })

      // Erreur 500 
      test('fetches messages from an API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error('Erreur 500'))
            },
          }
        })

        const html = BillsUI({ error: 'Erreur 500' })
        document.body.innerHTML = html
        await new Promise(process.nextTick)
        const errorMessage = await screen.getByText(/Erreur 500/)
        expect(errorMessage).toBeTruthy()
      })
    })
  })
})



  


