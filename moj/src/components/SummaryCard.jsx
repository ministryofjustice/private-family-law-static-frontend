import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './SummaryCard.css';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function SummaryCard() {
  return (
    <Card className="caseSummary" sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{mb: 1.5 }} variant="h3" /*component="div"*/>
          Case summary
        </Typography>
        <Typography sx={{mb: 1.5}} variant="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquet et ante sit amet gravida. Ut tortor diam, accumsan eu lacinia at, dictum a eros. Vivamus rhoncus eros in elit bibendum faucibus. Donec vitae neque leo. Quisque vel nisl dignissim, commodo dolor ut, luctus felis. Sed imperdiet consectetur consequat. Vestibulum quis maximus ipsum. Sed lobortis quam accumsan neque lobortis, ac mollis magna tempor. Integer id consequat nisl. Aliquam ac rhoncus ante, nec tincidunt sem.<br /><br />

          Aenean vel pulvinar arcu. Phasellus mauris risus, viverra sed tempus ac, egestas eget quam. Etiam porta sem ut dui fringilla lacinia. Aenean at nibh porta, tincidunt diam sit amet, consectetur ex. Quisque lobortis nec mauris eget suscipit. Sed semper non odio condimentum placerat. Aliquam pretium velit eget odio venenatis, quis luctus metus finibus. Integer iaculis volutpat porta. Maecenas laoreet velit quis maximus dictum. Suspendisse vitae turpis quis est accumsan lacinia vel sed velit. Mauris sagittis felis eu ipsum dapibus auctor. Nam elit nisi, finibus ut tempus et, commodo sit amet ante.<br /><br />

          Aliquam sit amet aliquet erat. Pellentesque sed mauris odio. Nullam ut odio maximus, lacinia arcu sit amet, elementum ante. Etiam eget tellus euismod, ultricies ex dapibus, fermentum quam. Maecenas sodales felis nibh, nec volutpat dolor finibus ut. Morbi tempor arcu porttitor, consequat ligula pretium, pretium libero. Vivamus libero ipsum, viverra quis ex id, tincidunt accumsan leo. Integer eleifend at libero ac scelerisque. Donec ligula mauris, vehicula et bibendum in, bibendum in ligula. Nulla justo ligula, ultricies eu condimentum id, pretium quis nisl. Ut ut turpis diam. Aliquam sit amet mollis ipsum. Ut nec lectus in lorem scelerisque condimentum vel imperdiet nisi. Vestibulum non tempus diam, non volutpat mi.<br /><br />

          Nam eu velit bibendum, consectetur tortor non, semper sapien. Quisque consequat nisi quam, malesuada bibendum dui congue id. Vivamus et venenatis ex. Aliquam a leo posuere erat dapibus porta. Sed egestas enim vitae odio pharetra laoreet. Fusce maximus mi tortor, id lacinia nisi dictum non. Praesent eget tincidunt sapien. Nulla facilisi. Aliquam tempus viverra nunc et ullamcorper.<br /><br />

          Phasellus faucibus gravida luctus. Nulla ultricies risus vehicula tincidunt bibendum. Morbi ut nulla orci. Suspendisse orci odio, molestie vitae leo id, aliquet pretium ante. Duis vitae eleifend libero. Nullam tincidunt, justo sed laoreet eleifend, nisi neque viverra eros, at consectetur nunc felis et erat. Vivamus faucibus risus quis dui aliquam, at dapibus nisi pellentesque. Sed interdum vulputate ligula, in ullamcorper quam pharetra nec. Donec magna tellus, tristique quis semper in, cursus ac eros. Suspendisse in est nec diam interdum dapibus. Sed accumsan arcu vitae nisl posuere ornare. Ut accumsan maximus nulla. Etiam et maximus magna.<br /><br />

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquet et ante sit amet gravida. Ut tortor diam, accumsan eu lacinia at, dictum a eros. Vivamus rhoncus eros in elit bibendum faucibus. Donec vitae neque leo. Quisque vel nisl dignissim, commodo dolor ut, luctus felis. Sed imperdiet consectetur consequat. Vestibulum quis maximus ipsum. Sed lobortis quam accumsan neque lobortis, ac mollis magna tempor. Integer id consequat nisl. Aliquam ac rhoncus ante, nec tincidunt sem.<br /><br />

          Aenean vel pulvinar arcu. Phasellus mauris risus, viverra sed tempus ac, egestas eget quam. Etiam porta sem ut dui fringilla lacinia. Aenean at nibh porta, tincidunt diam sit amet, consectetur ex. Quisque lobortis nec mauris eget suscipit. Sed semper non odio condimentum placerat. Aliquam pretium velit eget odio venenatis, quis luctus metus finibus. Integer iaculis volutpat porta. Maecenas laoreet velit quis maximus dictum. Suspendisse vitae turpis quis est accumsan lacinia vel sed velit. Mauris sagittis felis eu ipsum dapibus auctor. Nam elit nisi, finibus ut tempus et, commodo sit amet ante.
        </Typography>
      </CardContent>
    </Card>
  );
}