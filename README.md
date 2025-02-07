# Species Management System

This project is a web-based application for managing and displaying information about various species.

The Species Management System allows users to add, edit, and delete species records, providing a user-friendly interface for maintaining a database of species information. It utilizes modern web technologies to offer a responsive and interactive experience.

## Repository Structure

- `DataTables/`: Contains DataTables library files for enhanced table functionality
  - `datatables.js`: Main DataTables JavaScript file
  - `datatables.min.js`: Minified version of DataTables
- `Estilos/`: Contains custom CSS styles
  - `style.css`: Custom styles for the application
- `fontawesome-free-6.7.2-web/`: Font Awesome icon library
  - `css/`: CSS files for Font Awesome
  - `js/`: JavaScript files for Font Awesome
  - `metadata/`: Metadata files for Font Awesome icons
- `JS/`: Contains custom JavaScript files
  - `script.js`: Main application logic
- `index.html`: Main entry point of the application
- `prueba.html`: Test HTML file

## Usage Instructions

### Installation

1. Clone the repository to your local machine.
2. Ensure you have a modern web browser installed (Chrome, Firefox, Safari, or Edge).
3. No additional installation is required as this is a client-side application.

### Getting Started

1. Open `index.html` in your web browser to launch the application.
2. You will see a table displaying existing species records and a form to add new species.

### Adding a New Species

1. Fill out the form with the species details:
   - Scientific Name (required)
   - Common Name (required)
   - Habitat (select from dropdown)
   - Description (required, max 250 characters)
   - Image (required, JPG or PNG, max 2MB)
   - Status (select radio button)
2. Click "Add Species" to submit the form.
3. The new species will be added to the table with a fade-in animation.

### Editing a Species

1. Click the edit button (pencil icon) on the species row you want to modify.
2. The form will be populated with the species' current information.
3. Make your changes in the form.
4. Click "Save Changes" to update the species information.

### Deleting a Species

1. Click the delete button (trash icon) on the species row you want to remove.
2. Confirm the deletion in the popup dialog.
3. The species will be removed from the table with a fade-out animation.

### Searching and Sorting

- Use the search box above the table to filter species by any field.
- Click on column headers to sort the table by that column.

### Troubleshooting

- If images are not displaying, ensure the file path is correct and the image format is supported (JPG or PNG).
- If the table is not updating, try refreshing the page or check the browser console for any JavaScript errors.
- For performance issues, consider reducing the number of records or optimizing image sizes.

## Data Flow

1. User interacts with the HTML form to input species data.
2. JavaScript (script.js) captures form submission and validates input.
3. If valid, new species data is added to the DataTable.
4. DataTable updates the HTML table view.
5. On edit/delete, JavaScript modifies the DataTable, which updates the view.
6. Data is stored in browser's local storage for persistence.

```
[User Input] -> [Form Validation] -> [DataTable] -> [HTML Table View]
                                  -> [Local Storage]
```

## Deployment

This is a static web application and can be deployed on any web server or static hosting service.

1. Upload all files to your web server.
2. Ensure `index.html` is in the root directory.
3. Configure your web server to serve `index.html` as the default page.

No additional server-side setup is required as all functionality is client-side.