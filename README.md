# Modern Admin Portal

A comprehensive admin portal built with React, TypeScript, and Material-UI for managing user referrals and reward systems.

## 🚀 Features

### 📊 Dashboard
- **Real-time Metrics**: Total users, referrals, rewards, and growth statistics
- **Interactive Charts**: Monthly growth trends and reward distribution
- **Top Performers**: Display of top referrers and recent activities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 📈 Referral Management
- **Complete Referral Tracking**: View all referral data with detailed information
- **Advanced Filtering**: Filter by status, search by name/email
- **Export Functionality**: Download referral data as CSV
- **Action Buttons**: View details, export, and refresh capabilities

### 💰 Reward System
- **Reward Balance Tracking**: Monitor all reward transactions
- **Payment Processing**: Simulated payment processing for pending rewards
- **Visual Analytics**: Charts showing monthly distribution and reward types
- **Status Management**: Track paid, pending, and cancelled rewards

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Charts**: Recharts for data visualization
- **Data Grid**: MUI X Data Grid for advanced tables
- **Routing**: React Router v6
- **Data Parsing**: PapaParse for CSV handling
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your CSV data**
   - Place your CSV file in the `public` folder
   - Update the file path in `src/data/csvDataParser.ts` if needed

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
admin-portal/
├── public/
│   ├── users_202508071211.csv    # Your CSV data file
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard/            # Dashboard components
│   │   ├── Layout/              # Header, Sidebar, Layout
│   │   ├── Referrals/           # Referral report components
│   │   └── Rewards/             # Reward report components
│   ├── context/
│   │   └── DataContext.tsx      # Global data management
│   ├── data/
│   │   └── csvDataParser.ts     # CSV parsing logic
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── App.tsx                  # Main application component
├── package.json
└── README.md
```

## 📊 Data Format

The application expects a CSV file with the following columns:
- `id`: Unique identifier
- `user_id`: User ID
- `verified`: Verification status
- `referred_by`: Referrer information
- `rewards_earned`: Total rewards earned
- `referrals`: Number of referrals
- `user_name`: User's name

## 🎯 Usage

### Dashboard
- View overall metrics and trends
- Monitor top performers
- Track recent activities

### Referral Report
- **View Details**: Click the eye icon to see detailed referral information
- **Export Data**: Click "Export" to download filtered data as CSV
- **Filter & Search**: Use the search bar and status filters
- **Refresh**: Click "Refresh" to reload data

### Reward Balance Report
- **View Details**: Click the eye icon for reward details
- **Process Payments**: Click the payment icon for pending rewards
- **Export Data**: Download reward data as CSV
- **Advanced Filtering**: Filter by status and type

## 🔧 Configuration

### Customizing Data Source
Update the CSV file path in `src/data/csvDataParser.ts`:
```typescript
const csvUrl = '/your-csv-file.csv';
```

### Styling
The application uses Material-UI theming. Customize colors and styles in `src/App.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    // ... other theme options
  },
});
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/your-repo-name/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Built with ❤️ using React, TypeScript, and Material-UI**
