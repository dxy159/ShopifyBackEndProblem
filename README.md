# ShopifyBackEndProblem
Backend problem for internship application at Shopify. 

## The Challenge
1. Read all orders from the paginated API.
2. Any order without cookies can be fulfilled.
3. Prioritize fulfilling orders with the highest amount of cookies.
4. If orders have the same amount of cookies, prioritize the order with the lowest ID.
5. If an order has an amount of cookies bigger than the remaining cookies, skip the order.

## My Results
#### For Page 1
```
{ remaining_cookies: 2, unfulfilled_orders: '[3, 4]' }
```
#### For Page 2
```
{ remaining_cookies: 0, unfulfilled_orders: '[8, 9]' }
```