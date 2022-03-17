/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes.js";


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
      console.log('active icon')
    })    
    test("Then ... ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // to-do write assertion
      console.log(NewBillUI())

      })
  })
})
  describe("test toto()", () => {
    test("should return 5", () => {
      //on fbrique la page (<div>...</div>)
      document.body.innerHTML = NewBillUI()

      //On creer une fonction OnNavigate qui permet de naviguer sur les liens de la page
      //mais qui est demandee à la création de l'objet NewBill
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({pathname})
      }

      // On modifie le localStorage en le remplacant par le notre
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      //permet de set si on ets employé ou admin
      window.localStorage.setItem('user', JSON.stringify({ type: 'Admin'}))

      // enfin on peut creer notre class qui verifie la page
      const newBill = new NewBill({document, onNavigate, store: null, localStorage: window.localStorage })
    
      // expect()...

    })
  })

