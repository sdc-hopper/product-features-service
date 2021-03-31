import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import Banner from './banner.jsx';
import Features from './features.jsx';
import Setup from './setup.jsx';
import AdditionalFeatures from './additionalFeatures.jsx';
import dummyImages from '../dummyImages.js';

const ProductFeaturesStyle = styled.div`
  font-family:'Amazon Ember', Arial, sans-serif;
  max-width: 1504px;
  margin: 0px auto 0px auto;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const LoadingIcon = styled.span`
  background: url('https://m.media-amazon.com/images/S/sash/F0mWYzLleZMaLi7.png') 50% 50% no-repeat;
  animation: ${fadeIn} .3s ease-in, ${rotate} 1s linear infinite;
  width: 32px;
  height: 32px;
  background-size: 32px;
  display: inline-block;
`;

class ProductFeatures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productFeatures: [],
      productPhotos: dummyImages,
      httpStatusCode: null
    }
  }

  getProductFeatures(productId) {
    return axios.get(`http://localhost:4000/product-features/${productId}`)
  }

  getProductPhotos(productId) {
    return dummyImages;
  }

  fetchData(productId) {
    Promise.all([
      this.getProductFeatures(productId),
      this.getProductPhotos(productId)
    ])
    .then((res) => {
      this.setState({
        productFeatures: res[0].data,
        productPhotos: res[1] //res[1].data.featuresUrls
      })
    })
    .catch((err) => {
      this.setState({
        httpStatusCode: 404
      })
      console.log(err);
    })
  }

  componentDidMount() {
    const productId = window.location.pathname.split('/')[1] || 1000;
    this.fetchData(productId);
    console.log(this.state.productFeatures);
  }

  render() {
    const text = this.state.productFeatures;
    const img = this.state.productPhotos;

    return (
      (this.state.httpStatusCode === 404
      ? <h1 style={{textAlign: 'center'}}>Product Features Service Unavailable 404</h1>
      : this.state.productFeatures.length === 0
      ? <div style={{textAlign: 'center'}}><LoadingIcon/></div>
      : <ProductFeaturesStyle>
          <Banner
            bannerText={text.banner}
            bannerImage={img} />
          <Features
            featuresText={text.features}
            featuresPhotos={img} />
          <Setup
            featuresText={text.featureSetup}
            featuresSetupPhotos={img} />
          <AdditionalFeatures
            additionalFeaturesText={text.additionalFeatures}
            additionalFeaturesPhotos={img} />
        </ProductFeaturesStyle>
      )
    )
  }
}

export default ProductFeatures;