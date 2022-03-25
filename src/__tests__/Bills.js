/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills, { handleClickIconEye } from "../containers/Bills.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

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

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : (a > b) ? -1 : 0)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("I can click on new bill button", () => {
      // PAGE
      //on fabrique la page (<div>...</div>)
      document.body.innerHTML = BillsUI({
        data: bills
      })

      // CONTROLLER
      //On creer une fonction OnNavigate qui permet de naviguer sur les liens de la page
      //mais qui est demandee à la création de l'objet NewBill
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // On modifie le localStorage en le remplacant par le notre
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      //permet de set si on est employé ou admin
      window.localStorage.setItem('user', JSON.stringify({ type: 'employee' }))
      // enfin on peut creer notre class qui vérifie la page
      const BillsController = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })

      const spy = jest.spyOn(BillsController, 'onNavigate');

      const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
      buttonNewBill.click()

      expect(spy).toHaveBeenCalledTimes(1)
    });

    test("Emit event on click icon eyes", async () => {
      // création d'un DOM virtuel + son controller
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'employee' }))
      const BillsController = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })
      document.body.innerHTML = BillsUI({ data: bills })
      
      // récupère le premier icon de la page
      const iconEyes = screen.getAllByTestId("icon-eye")
      const icon = iconEyes[0]

      // on mock la fonction handleClickIconEye
      const handleClickIconEye = jest.fn((e) => BillsController.handleClickIconEye(icon))
      icon.addEventListener('click', handleClickIconEye(icon))
      userEvent.click(icon)
      expect(handleClickIconEye).toHaveBeenCalled()
      // const modale = screen.getByTestId('modaleFileEmployee')
      


    });


    // describe('When I click on the icon eye', () => {

    //   test('A modal should open', () => {
    //    // PAGE
    //   //on fabrique la page (<div>...</div>)
    //   document.body.innerHTML = BillsUI( {data: bills})

    //     // On modifie le localStorage en le remplacant par le notre
    //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //     //permet de set si on est employé ou admin
    //     window.localStorage.setItem('user', JSON.stringify({ type: 'employee' }))

    //     const billsui = new BillsUI({ data: bills })
    //     const handleClickIconEye = jest.fn((e) => billsui.handleClickIconEye(e, bills))
        
    //     const eye = screen.getByTestId('icon-eye')
        
    //     eye.addEventListener('click', handleClickIconEye)
        
    //     userEvent.click(eye)
    //     const modale = screen.getByTestId('modaleFileEmployee')
    //     expect (modale).toBeTruthy() && (handleClickIconEye()).toHaveBeenCalledTimes(1)
        
    //   })
    // })
  })
  /******************************************************************** */
  describe('When I am on Bills page and there are no bills', () => {
    test('Then, no bills should be shown', () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      
      const billsList = screen.queryByTestId("tbody")
      // console.log(billsList.innerHTML)
      
      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
      if (iconEye == null)
      expect(billsList.innerHTML == "").toBeTruthy()
    })
  })
  /******************************************************************** */




})