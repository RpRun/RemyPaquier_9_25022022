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
      
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy()

    })
  
  })
})

 

describe('When I provide a picture as proof of invoice', () => {
  test("then it should have been loaded in the input", () => {
    
    const html = NewBillUI()
    document.body.innerHTML = html
    
    const onNavigate = (pathname) => { document.body.innerHTML = ROUTES( { pathname } )}     
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    const NewBillController = new NewBill( { document, onNavigate, store: null, localStorage: window.localStorage } )
        
    // ======================================
    // input commentaire
    const inputCommentary = screen.getByTestId('commentary')
    fireEvent.change(inputCommentary, { target: { value: 'Hello' } })
    expect(inputCommentary.value).toBe('Hello')

    // ======================================
    // input file
    const file = new File(['dummy content'], 'example.png', {type: 'image/png'})
    const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)

    const inputFile = screen.getByTestId('file')
    Object.defineProperty(inputFile, 'files', { value: [file] })

    // const fileInput = document.querySelector(`input[data-testid="file"]`).files[0]
    
    // const imageInput = getByLabelText('Select an image')
    inputFile.addEventListener("change", handleChangeFile)
    fireEvent.change(inputFile)
    
    expect(handleChangeFile).toHaveBeenCalled()     
    expect(inputFile.files[0].name).toBe('example.png')
  })

})

describe("Given I am connected as an employee", () => {
  describe('When I am submitting a bill', () => {
    test("My form should be submitted...", () => {
      // On fabrique la page
      const html = NewBillUI()
      document.body.innerHTML = html
      //On creer une fonction OnNavigate qui permet de naviguer sur les liens de la page
      //mais qui est demandee à la création de l'objet NewBill
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      // On modifie le localStorage en le remplacant par le notre
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      //permet de set si on est employé ou admin
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const NewBillController = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })

      const newBillForm = document.querySelector(`form`)
      const updateBill = jest.fn(NewBillController.updateBill)

      newBillForm.addEventListener("submit", updateBill)
      newBillForm.submit()

      expect(updateBill).toHaveBeenCalled()  
        
    })
  })
})

