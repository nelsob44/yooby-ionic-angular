import { gql } from 'apollo-angular';

export const SAVE_PRODUCT = gql`
  mutation addProduct(
    $category: String!
    $description: String!
    $price: Float!
    $title: String!
    $minOrder: Float
    $sellerCountry: String
    $sellerLocation: String
    $sellerEmail: String
    $furtherDetails: String
    $availableQuantity: Int
    $discount: Float
    $promoStartDate: String
    $promoEndDate: String
    $images: [String]
  ) {
    addProduct(
      product: {
        category: $category
        description: $description
        price: $price
        title: $title
        minOrder: $minOrder
        sellerCountry: $sellerCountry
        sellerLocation: $sellerLocation
        sellerEmail: $sellerEmail
        furtherDetails: $furtherDetails
        availableQuantity: $availableQuantity
        discount: $discount
        promoStartDate: $promoStartDate
        promoEndDate: $promoEndDate
        images: $images
      }
    ) {
      id
      category
      description
      price
      title
      minOrder
      sellerCountry
      sellerLocation
      sellerEmail
      furtherDetails
      availableQuantity
      discount
      promoStartDate
      promoEndDate
      verifiedSeller
      reviews
      images
    }
  }
`;

export const GET_MY_PRODUCTS = gql`
  query getMyProducts($offset: Int, $limit: Int) {
    getMyProducts(myproductQuery: { offset: $offset, limit: $limit }) {
      totalItems
      product {
        id
        category
        description
        images
        price
        title
        minOrder
        sellerCountry
        sellerLocation
        sellerEmail
        verifiedSeller
        furtherDetails
        availableQuantity
        discount
        reviews
        promoEndDate
        promoStartDate
      }
    }
  }
`;

export const GET_AVAILABLE_PRODUCTS = gql`
  query getAvailableProducts($offset: Int, $limit: Int) {
    getAvailableProducts(pagination: { offset: $offset, limit: $limit }) {
      totalItems
      product {
        id
        category
        description
        images
        price
        title
        minOrder
        sellerCountry
        sellerLocation
        sellerEmail
        verifiedSeller
        furtherDetails
        availableQuantity
        discount
        reviews
        promoEndDate
        promoStartDate
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $id: ID!
    $category: String
    $description: String
    $price: Float
    $title: String
    $minOrder: Float
    $sellerCountry: String
    $sellerLocation: String
    $sellerEmail: String
    $furtherDetails: String
    $availableQuantity: Int
    $discount: Float
    $promoStartDate: String
    $promoEndDate: String
    $images: [String]
  ) {
    updateProduct(
      product: {
        id: $id
        category: $category
        description: $description
        price: $price
        title: $title
        minOrder: $minOrder
        sellerCountry: $sellerCountry
        sellerLocation: $sellerLocation
        sellerEmail: $sellerEmail
        furtherDetails: $furtherDetails
        availableQuantity: $availableQuantity
        discount: $discount
        promoStartDate: $promoStartDate
        promoEndDate: $promoEndDate
        images: $images
      }
    ) {
      id
      category
      description
      price
      title
      minOrder
      sellerCountry
      sellerLocation
      sellerEmail
      furtherDetails
      availableQuantity
      discount
      promoStartDate
      promoEndDate
      verifiedSeller
      reviews
      images
    }
  }
`;

export const DELETE_MY_PRODUCT = gql`
  mutation deleteProduct($id: ID) {
    deleteProduct(id: $id)
  }
`;
