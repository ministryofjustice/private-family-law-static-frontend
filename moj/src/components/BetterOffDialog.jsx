import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

const BetterOffDialog = ({
  open,
  onClose,
  betterOffForm,
  handleBetterOffInputChange,
  handleBetterOffSubmit,
  calculatingBetterOff
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Better Off Calculator</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          This calculator will estimate your entitlements and income.
        </Typography>
        
        <Grid container spacing={3}>
          {/* Personal Details Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Personal Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth (DD/MM/YYYY)"
              name="input_dob_user"
              variant="outlined"
              fullWidth
              value={betterOffForm.input_dob_user}
              onChange={handleBetterOffInputChange}
              placeholder="29/04/1996"
              helperText="Format: DD/MM/YYYY"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Relationship Status</InputLabel>
              <Select
                name="input_relationship_status"
                value={betterOffForm.input_relationship_status}
                label="Relationship Status"
                onChange={handleBetterOffInputChange}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="couple">Couple</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {betterOffForm.input_relationship_status === 'couple' && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Partner's Date of Birth (DD/MM/YYYY)"
                name="input_dob_partner"
                variant="outlined"
                fullWidth
                value={betterOffForm.input_dob_partner}
                onChange={handleBetterOffInputChange}
                placeholder="DD/MM/YYYY"
                helperText="Format: DD/MM/YYYY"
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Postcode"
              name="input_postcode"
              variant="outlined"
              fullWidth
              value={betterOffForm.input_postcode}
              onChange={handleBetterOffInputChange}
              placeholder="e.g. CH44 5RP"
            />
          </Grid>
          
          {/* Children and Care Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
              Children and Care
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Children"
              name="input_number_of_children"
              variant="outlined"
              fullWidth
              type="number"
              value={betterOffForm.input_number_of_children}
              onChange={handleBetterOffInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Childcare Costs (£)"
              name="input_childcare_costs"
              variant="outlined"
              fullWidth
              type="number"
              value={betterOffForm.input_childcare_costs}
              onChange={handleBetterOffInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          {/* Income and Housing Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
              Income and Housing
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Wage (£)"
              name="input_wage_user_job1"
              variant="outlined"
              fullWidth
              type="number"
              value={betterOffForm.input_wage_user_job1}
              onChange={handleBetterOffInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Cycle</InputLabel>
              <Select
                name="input_paymentcycle_user_job1"
                value={betterOffForm.input_paymentcycle_user_job1}
                label="Payment Cycle"
                onChange={handleBetterOffInputChange}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="fortnightly">Fortnightly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="four_weekly">Four Weekly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Savings (£)"
              name="input_savings"
              variant="outlined"
              fullWidth
              type="number"
              value={betterOffForm.input_savings}
              onChange={handleBetterOffInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Housing Sector</InputLabel>
              <Select
                name="input_housing_sector"
                value={betterOffForm.input_housing_sector}
                label="Housing Sector"
                onChange={handleBetterOffInputChange}
              >
                <MenuItem value="tenure_nohousingcosts">No Housing Costs</MenuItem>
                <MenuItem value="tenure_socialrented">Social Rented</MenuItem>
                <MenuItem value="tenure_privaterented">Private Rented</MenuItem>
                <MenuItem value="tenure_owner">Home Owner</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Additional Details Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
              Additional Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Disability Status</InputLabel>
              <Select
                name="input_placeholder_disability"
                value={betterOffForm.input_placeholder_disability}
                label="Disability Status"
                onChange={handleBetterOffInputChange}
              >
                <MenuItem value="no">No Disability</MenuItem>
                <MenuItem value="yes">Disabled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Current Benefits</InputLabel>
              <Select
                name="input_receiving_benefits"
                value={betterOffForm.input_receiving_benefits}
                label="Current Benefits"
                onChange={handleBetterOffInputChange}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="universal_credit">Universal Credit</MenuItem>
                <MenuItem value="income_support">Income Support</MenuItem>
                <MenuItem value="jsa_ib">JSA (Income-based)</MenuItem>
                <MenuItem value="jsa_cb">JSA (Contribution-based)</MenuItem>
                <MenuItem value="esa_ir">ESA (Income-related)</MenuItem>
                <MenuItem value="esa_cb">ESA (Contribution-based)</MenuItem>
                <MenuItem value="housing_benefit">Housing Benefit</MenuItem>
                <MenuItem value="child_tax_credit">Child Tax Credit</MenuItem>
                <MenuItem value="working_tax_credit">Working Tax Credit</MenuItem>
                <MenuItem value="pension_credit">Pension Credit</MenuItem>
                <MenuItem value="attendance_allowance">Attendance Allowance</MenuItem>
                <MenuItem value="pip">Personal Independence Payment</MenuItem>
                <MenuItem value="dla">Disability Living Allowance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleBetterOffSubmit}
          variant="contained"
          disabled={calculatingBetterOff}
          startIcon={calculatingBetterOff ? <CircularProgress size={20} /> : <CalculateIcon />}
        >
          {calculatingBetterOff ? 'Calculating...' : 'Calculate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BetterOffDialog;