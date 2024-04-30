import React, {Component} from 'react'
import Header from '../Header'
import DishItem from '../DishItem'
import './index.css'

class Home extends Component {
  state = {
    isLoading: true,
    response: [],
    activeCategoryId: '',
    cartItems: [],
  }

  componentDidMount() {
    this.fetchRestaurantApi()
  }

  addItemToCart = dish => {
    const {cartItems} = this.state
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (!isAlreadyExists) {
      const newDish = {...dish, quantity: 1}
      this.setState(prevState => ({
        cartItems: [...prevState.cartItems, newDish],
      }))
    } else {
      this.setState(prevState => ({
        cartItems: prevState.cartItems.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      }))
    }
  }

  removeItemFromCart = dish => {
    const {cartItems} = this.state
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (isAlreadyExists) {
      this.setState(prevState => ({
        cartItems: prevState.cartItems
          .map(item =>
            item.dishId === dish.dishId
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      }))
    }
  }

  getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  fetchRestaurantApi = async () => {
    const api = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const apiResponse = await fetch(api)
    const data = await apiResponse.json()
    const updatedData = this.getUpdatedData(data[0].table_menu_list)
    this.setState({
      response: updatedData,
      activeCategoryId: updatedData[0].menuCategoryId,
      isLoading: false,
    })
  }

  onUpdateActiveCategoryIdx = menuCategoryId => {
    this.setState({activeCategoryId: menuCategoryId})
  }

  renderTabMenuList = () =>
    this.state.response.map(eachCategory => {
      const onClickHandler = () =>
        this.onUpdateActiveCategoryIdx(eachCategory.menuCategoryId)

      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === this.state.activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button type="button" className="butt">
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })

  renderDishes = () => {
    const {categoryDishes} = this.state.response.find(
      eachCategory =>
        eachCategory.menuCategoryId === this.state.activeCategoryId,
    )

    return (
      <ul className="">
        {categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={this.state.cartItems}
            addItemToCart={this.addItemToCart}
            removeItemFromCart={this.removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  render() {
    const {isLoading, cartItems} = this.state
    return isLoading ? (
      this.renderSpinner()
    ) : (
      <div className="main-container">
        <Header cartItems={cartItems} />
        <ul className="container">{this.renderTabMenuList()}</ul>
        {this.renderDishes()}
      </div>
    )
  }
}

export default Home
