import React from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

export function withLocation(Component){
    return props => <Component {...props} location={useLocation()}/>
}

export function withNavigate(Component){
    return props => <Component {...props} navigate={useNavigate()}/>
}

export function withParams(Component){
    return props => <Component {...props} params={useParams()}/>
}

export function withSearchParams(Component){
    return props => <Component {...props} searchParamsService={useSearchParams()}/>
}

export function withRegistration(Component){
    return props => <Component {...props}/>
}

export function withLoadedData (Component, loadData) {
    return class extends React.Component {

        constructor(props){
            super(props)
    
            this.state = {
                data: []
            }
        }
    
        async componentDidMount(){ 
            let data = await loadData()
            console.log(data)
            this.setState({
                data
            })
        }
    
        render() {
 
            return(
                <Component data={this.state.data} {...this.props}/>
            );
        }
    }
}
