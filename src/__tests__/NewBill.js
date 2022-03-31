/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen,
  waitFor
} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
// import { bills } from "../fixtures/bills.js"

import {
  ROUTES
} from "../constants/routes.js"
import {
  localStorageMock
} from "../__mocks__/localStorage.js"

import router from "../app/Router.js";
import {
  ROUTES_PATH
} from "../constants/routes.js";




describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ... message icon in vertical layout should be highlighted", async () => {
   
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      //to-do write assertion
      const mailIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(mailIcon.classList.contains('active-icon')).toBeTruthy()

    })
    // test("Then ... ", () => {
    //   const html = NewBillUI()
    //   document.body.innerHTML = html
    //   // to-do write assertion
    //   expect()
    //   console.log(NewBillUI())

    //   })
  })
})
describe("test toto()", () => {
  test("should return 5", () => {
    //on fbrique la page (<div>...</div>)
    document.body.innerHTML = NewBillUI()

    //On creer une fonction OnNavigate qui permet de naviguer sur les liens de la page
    //mais qui est demandee à la création de l'objet NewBill
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({
        pathname
      })
    }

    // On modifie le localStorage en le remplacant par le notre
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })

    //permet de set si on ets employé ou admin
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    // enfin on peut creer notre class qui verifie la page
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage
    })

    // expect()...


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

        const NewBillController = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage
        })

        const newBillForm = document.querySelector(`form`)
        const updateBill = jest.fn(NewBillController.updateBill)

        newBillForm.addEventListener("submit", updateBill)
        newBillForm.submit()

        expect(updateBill).toHaveBeenCalled()     

      })

    })

  describe('When I provide a picture as proof of invoice', () => {
    test("then it should have been loaded in the input", () => {
      
      const html = NewBillUI()
      document.body.innerHTML = html
     
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}     
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })   
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const NewBillController = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage
      })
         
      const handleChangeFile  = jest.fn(NewBillController.handleChangeFile)
      const fileInput = screen.getByTestId('file')
      // const fileInput = document.querySelector(`input[data-testid="file"]`).files[0]
      
      const file = new File(['dummy content'], 'example.png', {type: 'image/png'})
      // const imageInput = getByLabelText('Select an image')
      // fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {target: {files: [file]}})

      // userEvent.change(fileInput)
      
      expect(handleChangeFile).toHaveBeenCalled()     
      expect(fileInput.files[0].name).toBe('example.png')
    })

  })

})

