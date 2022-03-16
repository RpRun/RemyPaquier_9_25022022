/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion


      
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
})
