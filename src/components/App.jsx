import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Searchbar from './SearchBar.jsx';
import ImageGallery from './ImageGallery.jsx';
import Button from './Button.jsx';
import Loader from './Loader.jsx';
import Modal from './Modal.jsx';

const API_KEY = '21202878-7eed95eba93d8479640dfcfe2';

class App extends Component {
  static propTypes = {
    // Dodaję propTypes
    query: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        webformatURL: PropTypes.string.isRequired,
        largeImageURL: PropTypes.string.isRequired,
      })
    ),
    page: PropTypes.number,
    isLoading: PropTypes.bool,
    showModal: PropTypes.bool,
    selectedImage: PropTypes.string,
  };

  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    showModal: false,
    selectedImage: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.fetchImages();
    }
    if (
      prevState.page !== this.state.page &&
      prevState.query === this.state.query
    ) {
      this.fetchImages();
    }
  }

  handleFormSubmit = query => {
    this.setState({ query, images: [], page: 1 });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleImageClick = image => {
    this.setState({ showModal: true, selectedImage: image.largeImageURL });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedImage: '' });
  };

  fetchImages = () => {
    const { query, page } = this.state;
    this.setState({ isLoading: true });

    axios
      .get(
        `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
      .then(response => {
        this.setState(prevState => ({
          images: [...prevState.images, ...response.data.hits],
        }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      });
  };

  render() {
    const { images, isLoading, showModal, selectedImage } = this.state;

    return (
      <div>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery images={images} onClick={this.handleImageClick} />
        {isLoading && <Loader />}
        {images.length > 0 && !isLoading && (
          <Button onClick={this.handleLoadMore} />
        )}
        {showModal && (
          <Modal
            onClose={this.handleCloseModal}
            largeImageURL={selectedImage}
          />
        )}
      </div>
    );
  }
}

export default App;
