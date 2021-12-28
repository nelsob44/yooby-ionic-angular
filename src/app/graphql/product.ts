import { gql } from 'apollo-angular';

export const SAVE_PRODUCT = gql`
  mutation addProduct(
    $category: String!
    $description: String!
    $price: Float!
    $title: String!
    $minOrder: Float
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
  query getMyProducts($sellerEmail: String) {
    getMyProducts(sellerEmail: $sellerEmail) {
      id
      category
      description
      images
      price
      title
      minOrder
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
`;

export const GET_AVAILABLE_PRODUCTS = gql`
  query getAvailableProducts($id: ID) {
    getAvailableProducts(id: $id) {
      id
      category
      description
      images
      price
      title
      minOrder
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
`;

export const DELETE_MY_PRODUCT = gql`
  mutation deleteProduct($id: ID) {
    deleteProduct(id: $id)
  }
`;
