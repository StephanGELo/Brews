import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Heading, Text, Card, Image, SearchField, Icon, Spinner } from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';
import './App.css';


const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  }

  async componentDidMount() {
    try {
      const { data } = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
            _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });
      this.setState({ brands: data.brands, loadingBrands: false })
    } catch (err) {
      console.log(err);
      this.setState({ loadingBrands: false })
    }
  }

  handleChange = ({ value }) => this.setState({
    searchTerm: value
  }, () => this.searchBrands());

  // filteredBrands = ({ searchTerm, brands }) => {
  //   return brands.filter((brand) => {
  //     return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //   });
  // };

  searchBrands = async () => {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
          brands(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
              _id
              name
              description
              image {
                url
            }
          }
        }`
      }
    });
    console.log(this.state.searchTerm, response.data.brands);
    this.setState({
      brands: response.data.brands,
      loadingBrands: false
    });
  }

  render() {
    const { searchTerm, loadingBrands, brands } = this.state;

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            accessibilityLabel="Brands Search Field"
            id='searchField'
            onChange={this.handleChange}
            value={searchTerm} //single source of Truth - control form
            placeholder="Search Brands ..."
          />
          <Box margin={3}>
            <Icon
              accessibilityLabel="Filter Icon"
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box
          display='flex'
          justifyContent='center'
          marginBottom={2}
        >
          {/* Brand Header */}
          <Heading color='midnight' size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#d6c8ec'
            }
          }}
          shape='rounded'
          wrap display="flex"
          justifyContent="around"
        >
          {/* {this.filteredBrands(this.state).map(brand => ( */}
          {brands.map(brand => (
            <Box paddingY={4} margin={2} width={200} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit='cover'
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image[0].url}`}
                    />
                  </Box>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text bold size="xl">{brand.name}</Text>
                  <Box height={80}>
                    <Text>{brand.description}</Text>
                  </Box>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>

                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
