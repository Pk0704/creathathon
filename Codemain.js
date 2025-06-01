import React, { useState } from 'react';
import { MapPin, Truck, ShoppingBag, Filter, Info, Zap, DollarSign, Clock, Star, AlertCircle, Calendar, TrendingUp, Coffee, Sun, Moon, Award, AlertTriangle, ChevronRight, Plus, Trash2 } from 'lucide-react';

const EnergyFoodFinder = () => {
  const [currentPage, setCurrentPage] = useState('finder');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    diet: '',
    budget: '',
    maxCarbs: 100,
    minProtein: 0,
    maxSugar: 50
  });
  
  // What-If Report State
  const [plannedMeals, setPlannedMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  // Sample restaurant data with energy scores
  const allRestaurants = [
    {
      id: 1,
      name: "Green Bowl Kitchen",
      rating: 4.5,
      distance: "0.8 mi",
      cuisine: "Healthy",
      priceRange: 2,
      deliveryTime: "25-35 min",
      energyScore: 5,
      dietOptions: ['vegetarian', 'vegan', 'gluten-free'],
      featured: [
        { name: "Grilled Chicken Salad", carbs: 15, protein: 35, sugar: 8, energyScore: 5, price: 12.99, calories: 380 },
        { name: "Quinoa Power Bowl", carbs: 45, protein: 25, sugar: 12, energyScore: 4, price: 13.99, vegetarian: true, calories: 420 },
        { name: "Green Smoothie", carbs: 35, protein: 8, sugar: 22, energyScore: 3, price: 8.99, vegetarian: true, vegan: true, calories: 180, category: "drink" },
        { name: "Protein Shake", carbs: 20, protein: 30, sugar: 15, energyScore: 4, price: 9.99, calories: 280, category: "drink" }
      ]
    },
    {
      id: 2,
      name: "Pasta Paradise",
      rating: 4.2,
      distance: "1.2 mi",
      cuisine: "Italian",
      priceRange: 3,
      deliveryTime: "30-40 min",
      energyScore: 2,
      dietOptions: ['vegetarian'],
      featured: [
        { name: "Fettuccine Alfredo", carbs: 85, protein: 20, sugar: 15, energyScore: 2, price: 16.99, vegetarian: true, calories: 820 },
        { name: "Chicken Marsala", carbs: 35, protein: 40, sugar: 10, energyScore: 4, price: 18.99, calories: 580 },
        { name: "Tiramisu", carbs: 65, protein: 6, sugar: 45, energyScore: 1, price: 7.99, vegetarian: true, calories: 450, category: "dessert" },
        { name: "Cappuccino", carbs: 8, protein: 4, sugar: 6, energyScore: 4, price: 4.99, vegetarian: true, calories: 80, category: "drink" }
      ]
    },
    {
      id: 3,
      name: "Protein Palace",
      rating: 4.7,
      distance: "2.1 mi",
      cuisine: "American",
      priceRange: 2,
      deliveryTime: "35-45 min",
      energyScore: 5,
      dietOptions: ['keto', 'paleo'],
      featured: [
        { name: "Steak & Veggies", carbs: 20, protein: 45, sugar: 5, energyScore: 5, price: 19.99, calories: 520 },
        { name: "Grilled Salmon Bowl", carbs: 25, protein: 38, sugar: 8, energyScore: 5, price: 17.99, calories: 480 }
      ]
    },
    {
      id: 4,
      name: "Fresh & Fit Cafe",
      rating: 4.9,
      distance: "3.0 mi",
      cuisine: "Healthy",
      priceRange: 3,
      deliveryTime: "40-50 min",
      energyScore: 5,
      dietOptions: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo'],
      featured: [
        { name: "Keto Bowl", carbs: 12, protein: 40, sugar: 4, energyScore: 5, price: 16.99, calories: 420 },
        { name: "Acai Bowl", carbs: 65, protein: 8, sugar: 35, energyScore: 1, price: 12.99, vegetarian: true, vegan: true, calories: 380 }
      ]
    },
    {
      id: 6,
      name: "Sweet Dreams Cafe",
      rating: 4.5,
      distance: "1.0 mi",
      cuisine: "Desserts & Coffee",
      priceRange: 2,
      deliveryTime: "20-30 min",
      energyScore: 2,
      dietOptions: ['vegetarian'],
      featured: [
        { name: "Chocolate Lava Cake", carbs: 68, protein: 8, sugar: 52, energyScore: 1, price: 8.99, vegetarian: true, calories: 480, category: "dessert" },
        { name: "Strawberry Cheesecake", carbs: 55, protein: 7, sugar: 42, energyScore: 1, price: 7.99, vegetarian: true, calories: 420, category: "dessert" },
        { name: "Iced Caramel Latte", carbs: 35, protein: 8, sugar: 28, energyScore: 2, price: 5.99, vegetarian: true, calories: 250, category: "drink" },
        { name: "Cold Brew Coffee", carbs: 0, protein: 0, sugar: 0, energyScore: 5, price: 4.99, vegan: true, calories: 5, category: "drink" },
        { name: "Matcha Milkshake", carbs: 62, protein: 10, sugar: 48, energyScore: 2, price: 6.99, vegetarian: true, calories: 380, category: "dessert" },
        { name: "Sugar-Free Iced Americano", carbs: 1, protein: 0, sugar: 0, energyScore: 5, price: 3.99, vegan: true, calories: 10, category: "drink" }
      ]
    }
  ];

  // Filter restaurants based on user preferences
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchingItems = restaurant.featured.filter(item => {
      if (filters.budget) {
        switch(filters.budget) {
          case '1': if (item.price >= 10) return false; break;
          case '2': if (item.price < 10 || item.price > 20) return false; break;
          case '3': if (item.price <= 20 || item.price > 30) return false; break;
          case '4': if (item.price <= 30) return false; break;
        }
      }
      
      if (filters.diet) {
        if (filters.diet === 'vegan' && !item.vegan) return false;
        if (filters.diet === 'vegetarian' && !item.vegetarian) return false;
        if (filters.diet === 'gluten-free' && !item.glutenFree) return false;
        if (filters.diet === 'keto' && !item.keto) return false;
        if (filters.diet === 'paleo' && !item.paleo) return false;
      }
      
      if (item.carbs > filters.maxCarbs) return false;
      if (item.protein < filters.minProtein) return false;
      
      return true;
    });
    
    return matchingItems.length > 0;
  });

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("Current Location");
          setIsLocating(false);
        },
        (error) => {
          alert("Unable to get location. Please enter manually.");
          setIsLocating(false);
        }
      );
    }
  };

  const EnergyBolts = ({ score }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Zap
            key={i}
            className={`w-4 h-4 ${
              i < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const PriceRange = ({ range }) => {
    return (
      <div className="flex items-center">
        {[...Array(4)].map((_, i) => (
          <DollarSign
            key={i}
            className={`w-3 h-3 ${
              i < range ? 'text-green-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // What-If Report Functions
  const addMealToPlan = (meal, mealTime, restaurant) => {
    const mealWithRestaurant = { ...meal, restaurant: restaurant.name };
    setPlannedMeals(prev => ({
      ...prev,
      [mealTime]: [...prev[mealTime], mealWithRestaurant]
    }));
  };

  const removeMealFromPlan = (mealTime, index) => {
    setPlannedMeals(prev => ({
      ...prev,
      [mealTime]: prev[mealTime].filter((_, i) => i !== index)
    }));
  };

  const calculateDayStats = () => {
    const allMeals = Object.values(plannedMeals).flat();
    
    const totals = allMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + meal.carbs,
      protein: acc.protein + meal.protein,
      sugar: acc.sugar + meal.sugar,
      cost: acc.cost + meal.price
    }), { calories: 0, carbs: 0, protein: 0, sugar: 0, cost: 0 });

    const energyCrashes = [];
    if (plannedMeals.breakfast.some(m => m.energyScore <= 2)) {
      energyCrashes.push({ time: '10:00 AM', severity: 'high', meal: 'breakfast' });
    }
    if (plannedMeals.lunch.some(m => m.energyScore <= 2)) {
      energyCrashes.push({ time: '2:30 PM', severity: 'high', meal: 'lunch' });
    }
    if (plannedMeals.dinner.some(m => m.energyScore <= 2)) {
      energyCrashes.push({ time: '8:00 PM', severity: 'medium', meal: 'dinner' });
    }

    const avgEnergyScore = allMeals.length > 0 
      ? allMeals.reduce((acc, meal) => acc + meal.energyScore, 0) / allMeals.length 
      : 0;

    return { totals, energyCrashes, avgEnergyScore, mealCount: allMeals.length };
  };

  const { totals, energyCrashes, avgEnergyScore, mealCount } = calculateDayStats();

  if (currentPage === 'report') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50">
        {/* Navigation Header */}
        <div className="bg-gradient-to-r from-blue-100 to-sky-100 shadow-sm sticky top-0 z-20 border-b border-blue-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-900">Energy-Smart Food Finder</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage('finder')}
                  className="px-4 py-2 rounded-lg transition-all text-blue-600 hover:bg-blue-50"
                >
                  Find Food
                </button>
                <button
                  onClick={() => setCurrentPage('report')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-white text-blue-700 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  What-If Report
                  {mealCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {mealCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What-If Report Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meal Planning Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-900">Plan Your Day</h2>
                  <button
                    onClick={() => setPlannedMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] })}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset Plan
                  </button>
                </div>
                
                {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealTime) => (
                  <div key={mealTime} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3">
                      {mealTime === 'breakfast' && <Coffee className="w-5 h-5 text-orange-500" />}
                      {mealTime === 'lunch' && <Sun className="w-5 h-5 text-yellow-500" />}
                      {mealTime === 'dinner' && <Moon className="w-5 h-5 text-indigo-500" />}
                      {mealTime === 'snacks' && <Award className="w-5 h-5 text-green-500" />}
                      <h3 className="text-lg font-medium text-blue-800 capitalize">{mealTime}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {plannedMeals[mealTime].map((meal, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-blue-900">{meal.name}</span>
                              {meal.category === 'dessert' && (
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Dessert</span>
                              )}
                              {meal.category === 'drink' && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Drink</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{meal.restaurant}</div>
                            <div className="flex gap-3 text-xs text-gray-600 mt-1">
                              <span>{meal.calories} cal</span>
                              <span>{meal.carbs}g carbs</span>
                              <span>{meal.protein}g protein</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <EnergyBolts score={meal.energyScore} />
                            <button
                              onClick={() => removeMealFromPlan(mealTime, idx)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {plannedMeals[mealTime].length === 0 && (
                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          No {mealTime} planned yet
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add Section */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Add Meals</h3>
                <div className="space-y-4">
                  {allRestaurants.slice(0, 3).map(restaurant => (
                    <div key={restaurant.id} className="border-b border-blue-100 pb-4 last:border-0">
                      <h4 className="font-medium text-blue-800 mb-2">{restaurant.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {restaurant.featured.map((meal, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-blue-50/30 rounded-lg p-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium">{meal.name}</div>
                              <div className="text-xs text-gray-600">${meal.price}</div>
                            </div>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMealToPlan(meal, e.target.value, restaurant);
                                  e.target.value = '';
                                }
                              }}
                              className="text-sm border border-blue-300 rounded px-2 py-1 bg-white/80"
                            >
                              <option value="">Add to...</option>
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch">Lunch</option>
                              <option value="dinner">Dinner</option>
                              <option value="snacks">Snacks</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-4">
              {/* Daily Summary */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Daily Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Calories</span>
                    <span className="font-semibold text-blue-900">{totals.calories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Carbs</span>
                    <span className="font-semibold text-blue-900">{totals.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Protein</span>
                    <span className="font-semibold text-blue-900">{totals.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sugar</span>
                    <span className="font-semibold text-blue-900">{totals.sugar}g</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-semibold text-green-600">${totals.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Prediction */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Energy Prediction</h3>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Average Energy Score</span>
                    <EnergyBolts score={Math.round(avgEnergyScore)} />
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        avgEnergyScore >= 4 ? 'bg-green-500' : 
                        avgEnergyScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(avgEnergyScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {energyCrashes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Predicted Energy Crashes
                    </h4>
                    {energyCrashes.map((crash, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-800">{crash.time}</span>
                          <span className="text-xs text-red-600">After {crash.meal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {energyCrashes.length === 0 && mealCount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Great choices! Steady energy all day</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommendations</h3>
                
                <div className="space-y-3 text-sm">
                  {totals.protein < 50 && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Consider adding more protein to maintain energy levels</span>
                    </div>
                  )}
                  {totals.sugar > 50 && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">High sugar intake detected - may cause energy crashes</span>
                    </div>
                  )}
                  {avgEnergyScore >= 4 && (
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Excellent meal planning for sustained energy!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50">
      {/* Navigation Header */}
      <div className="bg-gradient-to-r from-blue-100 to-sky-100 shadow-sm sticky top-0 z-20 border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">Energy-Smart Food Finder</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('finder')}
                className="px-4 py-2 rounded-lg transition-all bg-white text-blue-700 shadow-sm"
              >
                Find Food
              </button>
              <button
                onClick={() => setCurrentPage('report')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-blue-600 hover:bg-blue-50"
              >
                <Calendar className="w-4 h-4" />
                What-If Report
                {mealCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {mealCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Finder Content */}
      <div>
        {/* Location Input */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-blue-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
              <button
                onClick={getLocation}
                disabled={isLocating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLocating ? 'Locating...' : 'Use My Location'}
              </button>
            </div>

            {/* Delivery/Pickup Toggle & Filters */}
            <div className="flex justify-between items-center">
              <div className="flex bg-blue-100/50 backdrop-blur-sm rounded-lg p-1">
                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    deliveryMode === 'delivery' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Delivery
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    deliveryMode === 'pickup' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Pickup
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 bg-white/80 backdrop-blur-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/90 backdrop-blur-sm border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Dietary Preference</label>
                  <select
                    value={filters.diet}
                    onChange={(e) => setFilters({...filters, diet: e.target.value})}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white/80"
                  >
                    <option value="">All</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Budget</label>
                  <select
                    value={filters.budget}
                    onChange={(e) => setFilters({...filters, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white/80"
                  >
                    <option value="">Any Price</option>
                    <option value="1">$ (Under $10)</option>
                    <option value="2">$$ ($10-20)</option>
                    <option value="3">$$$ ($20-30)</option>
                    <option value="4">$$$$ ($30+)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Max Carbs (g)</label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={filters.maxCarbs}
                    onChange={(e) => setFilters({...filters, maxCarbs: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{filters.maxCarbs}g</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1">Min Protein (g)</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={filters.minProtein}
                    onChange={(e) => setFilters({...filters, minProtein: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{filters.minProtein}g</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Energy Info Banner */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Energy Ratings Explained:</strong> We calculate energy scores based on carb content, glycemic index, and sugar levels. 
              Higher scores (more bolts) indicate meals that provide sustained energy without the crash!
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Restaurants Near You</h2>
          
          <div className="space-y-4">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No restaurants match your filters</p>
                <p className="text-sm">Try adjusting your preferences to see more options</p>
              </div>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">{restaurant.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating}
                          </span>
                          <span>{restaurant.cuisine}</span>
                          <span>{restaurant.distance}</span>
                          <PriceRange range={restaurant.priceRange} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Energy Rating</div>
                        <EnergyBolts score={restaurant.energyScore} />
                      </div>
                    </div>
                    
                    {deliveryMode === 'delivery' && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <Clock className="w-4 h-4" />
                        {restaurant.deliveryTime}
                      </div>
                    )}
                    
                    <div className="border-t border-blue-100 pt-3">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Featured Energy-Smart Options:</h4>
                      <div className="space-y-2">
                        {restaurant.featured
                          .filter(item => {
                            if (filters.budget) {
                              switch(filters.budget) {
                                case '1': return item.price < 10;
                                case '2': return item.price >= 10 && item.price <= 20;
                                case '3': return item.price > 20 && item.price <= 30;
                                case '4': return item.price > 30;
                              }
                            }
                            return true;
                          })
                          .filter(item => {
                            if (filters.diet === 'vegan') return item.vegan === true;
                            if (filters.diet === 'vegetarian') return item.vegetarian === true;
                            if (filters.diet === 'gluten-free') return item.glutenFree === true;
                            if (filters.diet === 'keto') return item.keto === true;
                            if (filters.diet === 'paleo') return item.paleo === true;
                            return true;
                          })
                          .filter(item => {
                            return item.carbs <= filters.maxCarbs && item.protein >= filters.minProtein;
                          })
                          .map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-blue-900">{item.name}</h5>
                                {item.category === 'dessert' && (
                                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Dessert</span>
                                )}
                                {item.category === 'drink' && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Drink</span>
                                )}
                                {item.energyScore <= 2 && (
                                  <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <AlertCircle className="w-3 h-3" />
                                    Food Coma Risk
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-3 text-xs text-gray-600 mt-1">
                                <span className={item.carbs > 60 ? 'text-red-600 font-medium' : ''}>
                                  Carbs: {item.carbs}g
                                </span>
                                <span>Protein: {item.protein}g</span>
                                <span className={item.sugar > 20 ? 'text-red-600 font-medium' : ''}>
                                  Sugar: {item.sugar}g
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-blue-900">${item.price}</div>
                              <EnergyBolts score={item.energyScore} />
                              <button
                                onClick={() => {
                                  const mealTime = prompt('Add to which meal? (breakfast/lunch/dinner/snacks)');
                                  if (mealTime && ['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealTime)) {
                                    addMealToPlan(item, mealTime, restaurant);
                                  }
                                }}
                                className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                              >
                                Add to Plan
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFoodFinder;
  );
};

export default EnergyFoodFinder;
