# Spa API Endpoints

This document outlines the available API endpoints for interacting with the Spa application.

## Authentication

### Obtain Token

- Endpoint: `/api/token/`
- Method: `POST`
- Description: Retrieves an access token by providing valid credentials.
- Request Body:
  - `username` (string): The username of the user.
  - `password` (string): The password of the user.
- Response Body:
  - `access` (string): The access token.
  - `refresh` (string): The refresh token.

### Refresh Token

- Endpoint: `/api/token/refresh/`
- Method: `POST`
- Description: Retrieves a new access token by providing a valid refresh token.
- Request Body:
  - `refresh` (string): The refresh token.
- Response Body:
  - `access` (string): The new access token.

## Spas

### Retrieve Spas

- Endpoint: `/spas/`
- Method: `GET`
- Description: Retrieves all spas.
- Response Body:
  - List of spa objects containing the following fields:
    - `name` (string): The name of the spa.
    - `main_image` (string): The URL of the main image of the spa.
    - `mul_image` (string): The URL of the multiple images of the spa.
    - `address` (string): The address of the spa.
    - `landmark` (string): The landmark near the spa.
    - `mobile_number` (string): The contact number of the spa.
    - `booking_number` (string): The booking contact number of the spa.
    - `gmap_link` (string): The Google Maps link of the spa.
    - `city` (string): The city where the spa is located.
    - `area` (string): The area where the spa is located.
    - `spa_longitude` (float): The longitude coordinate of the spa's location.
    - `spa_latitude` (float): The latitude coordinate of the spa's location.
    - `open_time` (string): The opening time of the spa.
    - `close_time` (string): The closing time of the spa.
    - `slug` (string): The slug of the spa.
    - `about_us` (string): Information about the spa.
    - `open` (boolean): Indicates if the spa is currently open.
    - `verified` (boolean): Indicates if the spa is verified.
    - `top_rated` (boolean): Indicates if the spa is top-rated.
    - `premium` (boolean): Indicates if the spa is a premium spa.
    - `luxurious` (boolean): Indicates if the spa is luxurious.
    - `priority` (integer): The priority of the spa.

### Update Spa Details

- Endpoint: `/spas/<id>/`
- Method: `PUT` or `PATCH`
- Description: Updates the details of a specific spa.
- Path Parameters:
  - `id` (integer): The ID of the spa to update.
- Request Body:
  - `name` (string): The updated name of the spa.
  - `main_image` (file): The updated main image of the spa.
  - `mul_image` (file): The updated multiple images of the spa.
  - `address` (string): The updated address of the spa.
  - `landmark` (string): The updated landmark of the spa.
  - `mobile_number` (string): The updated mobile number of the spa.
  - `booking_number` (string): The updated booking number of the spa.
  - `gmap_link` (string): The updated Google Maps link of the spa.
  - `city` (string): The updated city of the spa.
  - `area` (string): The updated area of the spa.
  - `spa_longitude` (float): The updated longitude coordinate of the spa location.
  - `spa_latitude` (float): The updated latitude coordinate of the spa location.
  - `open_time` (string): The updated opening time of the spa.
  - `close_time` (string): The updated closing time of the spa.
  - `slug` (string): The updated slug of the spa.
  - `about_us` (string): The updated about us content of the spa.
  - `open` (boolean): The updated open status of the spa.
  - `verified` (boolean): The updated verification status of the spa.
  - `top_rated` (boolean): The updated top rated status of the spa.
  - `premium` (boolean): The updated premium status of the spa.
  - `luxurious` (boolean): The updated luxurious status of the spa.
  - `priority` (integer): The updated priority of the spa.
- Response Body:
  - Updated spa object.

### Search Spas

- Endpoint: `/search-spa/`
- Method: `GET`
- Description: Searches for spas based on specified criteria.
- Query Parameters:
  - `query` (string): The search query.
- Response Body:
  - List of spa objects matching the search query.

### Filter Spas

- Endpoint: `/filter-spa/`
- Method: `GET`
- Description: Filters spas based on specified criteria.
- Query Parameters:
  - `city` (string): The city to filter by.
  - `area` (string): The area to filter by.
- Response Body:
  - List of spa objects matching the filter criteria.

### Nearby Spas

- Endpoint: `/nearby-spa/`
- Method: `GET`
- Description: Retrieves spas near a specified location.
- Query Parameters:
  - `latitude` (float): The latitude

 coordinate of the location.

- `longitude` (float): The longitude coordinate of the location.
- `radius` (integer): The radius (in meters) within which to search for spas.
- Response Body:
  - List of spa objects near the specified location.

## FAQs

### Retrieve FAQs

- Endpoint: `/faqs/`
- Method: `GET`
- Description: Retrieves all FAQs.
- Response Body:
  - List of FAQ objects containing the following fields:
    - `question` (string): The question.
    - `answer` (string): The answer.
    - `date` (string): The date the FAQ was created.

### Update FAQ

- Endpoint: `/faqs/<id>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific FAQ.
- Path Parameters:
  - `id` (integer): The ID of the FAQ to update.
- Request Body:
  - `question` (string): The updated question.
  - `answer` (string): The updated answer.
- Response Body:
  - Updated FAQ object.

## Blogs

### Retrieve Blogs

- Endpoint: `/blogs/`
- Method: `GET`
- Description: Retrieves all blogs.
- Response Body:
  - List of blog objects containing the following fields:
    - `title` (string): The title of the blog.
    - `content` (string): The content of the blog.
    - `date` (string): The date the blog was published.

### Update Blog

- Endpoint: `/blogs/<id>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific blog.
- Path Parameters:
  - `id` (integer): The ID of the blog to update.
- Request Body:
  - `title` (string): The updated title.
  - `content` (string): The updated content.
- Response Body:
  - Updated blog object.

## City

### Retrieve Cities

- Endpoint: `/city/`
- Method: `GET`
- Description: Retrieves all cities.
- Response Body:
  - List of city objects containing the following fields:
    - `name` (string): The name of the city.
    - `priority` (integer): The priority of the city.

### Update City

- Endpoint: `/city/<id>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific city.
- Path Parameters:
  - `id` (integer): The ID of the city to update.
- Request Body:
  - `name` (string): The updated name.
  - `priority` (integer): The updated priority.
- Response Body:
  - Updated city object.

## Area

### Retrieve Areas

- Endpoint: `/area/`
- Method: `GET`
- Description: Retrieves all areas.
- Response Body:
  - List of area objects containing the following fields:
    - `name` (string): The name of the area.
    - `priority` (integer): The priority of the area.
    - `city` (integer): The ID of the city to which the area belongs.

### Update Area

- Endpoint: `/area/<id>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific area.
- Path Parameters:
  - `id` (integer): The ID of the area to update.
- Request Body:
  - `name` (string): The updated name.
  - `priority` (integer): The updated priority.
  - `city` (integer): The ID of the city to which the area belongs.
- Response Body:
  - Updated area object.

## Offers

### Retrieve Offers

- Endpoint: `/offer/`
- Method: `GET`
- Description: Retrieves all offers.
- Response Body:
  - List of offer objects containing the following fields:
    - `name` (string): The name of the offer.
    - `slug` (string): The slug of the offer.
    - `priority` (integer): The priority of the offer.
    - `img_url` (string): The URL of the offer image.
    - `discount` (number): The discount percentage of the offer.

### Update Offer

- Endpoint: `/offer/<pk>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific offer.
- Path Parameters:
  - `pk` (integer): The primary key of the offer to update.
- Request Body:
  - `name` (string): The updated name.
  - `slug` (string): The updated slug.
  - `priority` (integer): The updated priority.
  - `img_url` (string): The updated URL of the offer image.
  - `discount` (number): The updated discount percentage.
- Response Body:
  - Updated offer object.

## Therapies

### Retrieve Therapies

- Endpoint: `/therapy/`
- Method: `GET`
- Description: Retrieves all therapies.
- Response Body:
  - List of therapy objects containing the following fields:
    - `name` (string): The name of the therapy.
    - `slug` (string): The slug of the therapy.
    - `priority` (integer): The priority of the therapy.
    - `image_url` (string): The URL of the therapy image.

### Update Therapy

- Endpoint: `/therapy/<pk>/`
- Method: `PUT` or `PATCH`
- Description: Updates a specific therapy.
- Path Parameters:
  - `pk` (integer): The primary key of the therapy to update.
- Request Body:
  - `name` (string): The updated name.
  - `slug` (string): The updated slug.
  - `priority` (integer): The updated priority.
  - `image_url` (string): The updated URL of the therapy image.
- Response Body:
  - Updated therapy object.

## API Endpoints

The following API endpoints are available for managing salons and related entities:

### Salons

### Blog Model

The `Blog` model represents a blog post in the system. It has the following parameters:

- `title`: A character field with a maximum length of 255 representing the title of the blog post.
- `content`: A text field representing the content of the blog post.
- `date`: A date field with a default value set to the current date.

### City Model

The `City` model represents a city in the system. It has the following parameters:

- `name`: A character field with a maximum length of 100 representing the name of the city.
- `priority`: An integer field representing the priority of the city, with uniqueness enforced.

### Area Model

The `Area` model represents an area within a city. It has the following parameters:

- `name`: A character field with a maximum length of 100 representing the name of the area.
- `priority`: An integer field representing the priority of the area, with uniqueness enforced.
- `city`: A foreign key to the `City` model representing the city to which the area belongs.

### FAQ Model

The `FAQ` model represents a frequently asked question in the system. It has the following parameters:

- `question`: A text field representing the question being asked.
- `answer`: A text field representing the corresponding answer to the question.
- `date`: A date field with a default value set to the current date.

### Salon Model

The `Salon` model represents a salon entity in the system. It has the following parameters:

- `name`: A character field with a maximum length of 200 representing the name of the salon.
- `main_image`: An image field storing the main image of the salon, with an upload path specified.
- `address`: A character field with a maximum length of 255 representing the address of the salon.
- `landmark`: A character field with a maximum length of 255 representing a landmark associated with the salon, with a default value provided.
- `mobile_number`: A character field with a maximum length of 255 representing the contact mobile number of the salon.
- `booking_number`: A character field with a maximum length of 255 representing the booking contact number of the salon.
- `gmap_link`: A character field with a maximum length of 255 representing the Google Maps link of the salon.
- `city`: A character field with a maximum length of 255 representing the city where the salon is located.
- `area`: A character field with a maximum length of 255 representing the area where the salon is situated.
- `salon_longitude`: A float field representing the longitude of the salon's location, with a default value provided.
- `salon_latitude`: A float field representing the latitude of the salon's location, with a default value provided.
- `open_time`: A time field with a maximum length of 255 representing the opening time of the salon, with a default value provided.
- `close_time`: A time field with a maximum length of 255 representing the closing time of the salon, with a default value provided.
- `slug`: A character field with a maximum length of 255 representing a slug for the salon.
- `about_us`: A text field representing information about the salon.
- `open`: A boolean field indicating whether the salon is currently open, with a default value provided.
- `verified`: A boolean field indicating whether the salon is verified

, with a default value provided.

- `top_rated`: A boolean field indicating whether the salon is top-rated, with a default value provided.
- `premium`: A boolean field indicating whether the salon is a premium salon, with a default value provided.
- `salon_academy`: A boolean field indicating whether the salon has an academy, with a default value provided.
- `bridal`: A boolean field indicating whether the salon offers bridal services, with a default value provided.
- `makeup`: A boolean field indicating whether the salon offers makeup services, with a default value provided.
- `priority`: An integer field representing the priority of the salon, with uniqueness enforced.

### Offer Model

The `Offer` model represents an offer or promotion in the system. It has the following parameters:

- `name`: A character field with a maximum length of 100 representing the name of the offer.
- `slug`: A slug field with uniqueness enforced, representing a slug for the offer.
- `priority`: An integer field representing the priority of the offer.
- `img_url`: An image field storing the image associated with the offer, with an upload path specified.
- `discount`: A decimal field with a maximum of 5 digits and 2 decimal places representing the discount value.
- `salon`: A foreign key to the `Salon` model representing the salon to which the offer belongs.

### TherapyModel Model

The `TherapyModel` model represents a therapy in the system. It has the following parameters:

- `name`: A character field with a maximum length of 100 and uniqueness enforced, representing the name of the therapy.
- `slug`: A slug field with uniqueness enforced, representing a slug for the therapy.
- `priority`: An integer field with uniqueness enforced representing the priority of the therapy.
- `image_url`: An image field storing the image associated with the therapy, with an upload path specified.
- `salon`: A foreign key to the `Salon` model representing the salon to which the therapy belongs.

### Services Model

The `Services` model represents the services offered by a salon. It has the following parameters:

- `salon`: A foreign key to the `Salon` model representing the salon offering the service.
- `service_name`: A character field with a maximum length of 255 representing the name of the service.
- `service_time`: A character field with a maximum length of 255 representing the duration of the service.
- `description`: A text field representing the description of the service.
- `price`: A float field representing the price of the service.
- `discount`: A float field representing the discount value for the service.
- `therapies`: A foreign key to the `TherapyModel` model representing the therapy associated with the service.

### Log Model

The `Log` model represents a log entry in the system. It has the following parameters:

- `name`: A character field with a maximum length of 255 representing the name of the

 log entry.

- `category`: A character field with a maximum length of 255 representing the category of the log entry.
- `location`: A JSON field representing the location information of the log entry.
- `time`: A date and time field with auto_now_add set to `True`, representing the timestamp of the log entry.
- `actiontype`: A character field with a maximum length of 255 representing the action type of the log entry, with predefined choices available ("call_now", "Call Now" and "book_now", "Book Now").

### End Points

- `GET /salons/`: Retrieve a list of all salons.
- `POST /salons/`: Create a new salon.
- `GET /salons/<id>/`: Retrieve details of a specific salon.
- `PUT /salons/<id>/`: Update details of a specific salon.
- `PATCH /salons/<id>/`: Partially update details of a specific salon.
- `DELETE /salons/<id>/`: Delete a specific salon.

### Salon Search

- `GET /salons/search/`: Search for salons based on specific criteria.

### Salon Filtering

- `GET /salons/filter-salon/`: Filter salons based on specific criteria.

### Nearby Salons

- `GET /salons/nearby-salon/`: Retrieve salons located nearby based on geographical coordinates.

### FAQs

- `GET /salons/faqs/`: Retrieve a list of all FAQs.
- `POST /salons/faqs/`: Create a new FAQ.
- `GET /salons/faqs/<id>/`: Retrieve details of a specific FAQ.
- `PUT /salons/faqs/<id>/`: Update details of a specific FAQ.
- `DELETE /salons/faqs/<id>/`: Delete a specific FAQ.

### Blogs

- `GET /salons/blogs/`: Retrieve a list of all blog posts.
- `POST /salons/blogs/`: Create a new blog post.
- `GET /salons/blogs/<id>/`: Retrieve details of a specific blog post.
- `PUT /salons/blogs/<id>/`: Update details of a specific blog post.
- `DELETE /salons/blogs/<id>/`: Delete a specific blog post.

### City

- `GET /salons/city/`: Retrieve a list of all cities.
- `POST /salons/city/`: Create a new city.
- `GET /salons/city/<id>/`: Retrieve details of a specific city.
- `PUT /salons/city/<id>/`: Update details of a specific city.
- `DELETE /salons/city/<id>/`: Delete a specific city.

### Area

- `GET /salons/area/`: Retrieve a list of all areas.
- `POST /salons/area/`: Create a new area.
- `GET /salons/area/<id>/`: Retrieve details of a specific area.
- `PUT /salons/area/<id>/`: Update details of a specific area.
- `DELETE /salons/area/<id>/`: Delete a specific area.

### Offers

- `GET /salons/offer/`: Retrieve a list of all offers.
- `POST /salons/offer/`: Create a new offer.
- `GET /salons/offer/<id>/`: Retrieve details of a specific offer.
- `PUT /salons/offer/<id>/`: Update details of a specific offer.
- `DELETE /salons/offer/<id>/`: Delete a specific offer.

### Services

- `GET /salons/service/`: Retrieve a list of all services.
- `POST /salons/service/`: Create a new service.
- `GET /salons/service/<id>/`: Retrieve details of a specific service.
- `PUT /salons/service/<id>/`: Update details of a specific service.
- `DELETE /salons/service/<id>/`: Delete a specific service.

### Therapy

- `GET /salons/therapy/`: Retrieve a list of all therapy models.
- `POST /salons/therapy/`: Create a new therapy model.
- `GET /salons/therapy/<pk>/`: Retrieve details of a specific therapy model.
- `PUT /salons/therapy/<pk>/`: Update details of a specific therapy model.
- `DELETE /salons/therapy/<pk>/`: Delete a specific therapy model.

### Log Entries

- `GET /salons/log-entry/`: Retrieve a list of all log entries.
- `POST /salons/log-entry/`: Create a new log entry.

Please note that the actual URL for accessing these endpoints will depend on your server configuration. Make sure to replace `<id>` and `<pk>` with the corresponding IDs or primary keys when making requests to the specific endpoints.
