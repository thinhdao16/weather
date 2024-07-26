import HomePage from "./HomePage"
import { renderWithRouter } from "../test/utils/utils"



describe('<HomePage/>',()=>{
    test('render correctly',()=>{
        const {asFragment} = renderWithRouter(<HomePage/>)
        expect(asFragment()).toMatchSnapshot()
    })
})