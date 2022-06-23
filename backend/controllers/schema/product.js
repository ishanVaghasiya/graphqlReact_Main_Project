module.exports = `
input InputCreateProduct {
    userId: Int
    productName: String
    productPrice: String
    weight: String
    image: String
    manufacturedBy: String
}
input InputUpdateProduct {
    productId: Int
    userId: Int
    productName: String
    productPrice: String
    weight: String
    image: String
    manufacturedBy: String
}

type Product {
    productId: Int
    userId: Int
    productName: String
    productPrice: String
    weight: String
    image: String
    manufacturedBy: String
    status: Int
    createdAt: String
    createdBy: Int
    updatedAt: String
    updatedBy: Int
    deletedAt: String
    deletedBy: Int
  }

  type ResponseMutation {
    status: Boolean
    code: Int
    message: String
  }

  type RepsonseGetAllProducts {
    status: Boolean
    code: Int
    message: String
    data: [Product]
  }

  type RepsonseGetProductByProductId {
    status: Boolean
    code: Int
    message: String
    data: Product
  }


  type RootQuery {
    getAllProduct: RepsonseGetAllProducts!
    getProductsByProductId(productId: Int): RepsonseGetProductByProductId!
    getProductsByUser(userId: Int): RepsonseGetAllProducts!
  }

  type RootMutation {
    createPost(data: InputCreatePost): ResponseMutation!
    updatePost(data: InputUpdatePost): ResponseMutation!
    deletePost(postId: Int): ResponseMutation!
  }

  
   schema {
    query: RootQuery
    mutation: RootMutation
  }


`;
