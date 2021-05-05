import React from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
    state = {
        brews: [],

    }
    async componentDidMount() {
        console.log(this.props.match.params.brandId)
        try {
            const response = await strapi.request('POST', '/graphql', {
                data: {
                    query: `query {
                            brand(id: "${this.props.match.params.brandId}") {
                            _id
                            name
                            brews {
                                _id
                                name
                                price
                                image {
                                    url
                                }
                            }
                        }
                    }`
                }
            });
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }
    render() {
        return (
            <div>Brews!</div>
        );
    }
};

export default Brews;