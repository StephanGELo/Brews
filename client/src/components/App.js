import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Heading, Text, Card, Image, SearchField, Icon } from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);
// import './App.css';

class App extends Component {
  state = {
    brands: [],
    searchTerm: ""
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
      this.setState({ brands: data.brands })
    } catch (err) {
      console.log(err);
    }
  }

  handleChange = ({ value }) => this.setState({
    searchTerm: value
  });

  render() {
    const { brands, searchTerm } = this.state;

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            accessibilityLabel="Brands Search Field"
            id='searchField'
            onChange={this.handleChange}
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
      </Container>
    );
  }
}

export default App;
