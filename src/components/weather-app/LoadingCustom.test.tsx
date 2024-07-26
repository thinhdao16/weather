import { render } from "@testing-library/react"
import { LoadingCustom } from "./LoadingCustom"

describe('<Loading />',()=>{
    test('render correctly',()=>{
        const {asFragment} = render(<LoadingCustom/>)
        expect(asFragment()).toMatchSnapshot()
    })
})