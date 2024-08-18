import React from 'react';
import { Typography } from '@mui/material';
import { Link } from '@mui/material';
import BiologyImage from '../Images/Biology.png';

const BiologyContent = () => {
  return (
    <div>
<Typography variant="h5" gutterBottom>
            Mitochondria 
            </Typography>
            <Typography paragraph>
              Mitochondria are membrane-bound organelles present in the cytoplasm of all eukaryotic cells, that produce adenosine triphosphate (ATP), the main energy molecule used by the cell.
            </Typography>
            <Typography variant="h6" gutterBottom>
              What are Mitochondria?
            </Typography>
            <Typography paragraph>
              Popularly known as the “Powerhouse of the cell,” mitochondria (singular: mitochondrion) are a double membrane-bound organelle found in most eukaryotic organisms. They are found inside the cytoplasm and essentially function as the cell’s “digestive system.”
            </Typography>
            <Typography paragraph>
              They play a major role in breaking down nutrients and generating energy-rich molecules for the cell. Many of the biochemical reactions involved in cellular respiration take place within the mitochondria. The term ‘mitochondrion’ is derived from the Greek words “mitos” and “chondrion” which means “thread” and “granules-like”, respectively. It was first described by a German pathologist named Richard Altmann in the year 1890.
            </Typography>
            <Typography paragraph>
              Also refer: <Link href='https://byjus.com/biology/cell-organelles/' target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>Cell Organelles</Link>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Mitochondria Diagram
            </Typography>
            <Typography paragraph>
              The diagram of mitochondria below illustrates several structural features of mitochondria.
            </Typography>
            <img src={BiologyImage} alt="Biology" style={{ maxWidth: '50%', height: 'auto' }} />;
            <Typography variant="h6" gutterBottom>
              Mitochondrion
            </Typography>
            <Typography paragraph>
              Structure of Mitochondria
            </Typography>
            <Typography paragraph>
              The mitochondrion is a double-membraned, rod-shaped structure found in both plant and animal cells. Its size ranges from 0.5 to 1.0 micrometre in diameter. The structure comprises an outer membrane, an inner membrane, and a gel-like material called the matrix. The outer membrane and the inner membrane are made of proteins and phospholipid layers separated by the intermembrane space. The outer membrane covers the surface of the mitochondrion and has a large number of special proteins known as porins.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Cristae
            </Typography>
            <Typography paragraph>
              The inner membrane of mitochondria is rather complex in structure. It has many folds that form a layered structure called cristae, and this helps in increasing the surface area inside the organelle. The cristae and the proteins of the inner membrane aid in the production of ATP molecules. The inner mitochondrial membrane is strictly permeable only to oxygen and ATP molecules. A number of chemical reactions take place within the inner membrane of mitochondria.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Mitochondrial Matrix
            </Typography>
            <Typography paragraph>
              The mitochondrial matrix is a viscous fluid that contains a mixture of enzymes and proteins. It also comprises ribosomes, inorganic ions, mitochondrial DNA, nucleotide cofactors, and organic molecules. The enzymes present in the matrix play an important role in the synthesis of ATP molecules.
            </Typography>
            <Typography paragraph>
              Also Read: Difference between mitochondria and plastids
            </Typography>
            <Typography variant="h6" gutterBottom>
              Functions of Mitochondria
            </Typography>
            <Typography paragraph>
              The most important function of mitochondria is to produce energy through the process of oxidative phosphorylation. It is also involved in the following process:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <Typography component="li">Regulates the metabolic activity of the cell</Typography>
              <Typography component="li">Promotes the growth of new cells and cell multiplication</Typography>
              <Typography component="li">Helps in detoxifying ammonia in the liver cells</Typography>
              <Typography component="li">Plays an important role in apoptosis or programmed cell death</Typography>
              <Typography component="li">Responsible for building certain parts of the blood and various hormones like testosterone and oestrogen</Typography>
              <Typography component="li">Helps in maintaining an adequate concentration of calcium ions within the compartments of the cell</Typography>
              <Typography component="li">It is also involved in various cellular activities like cellular differentiation, cell signalling, cell senescence, controlling the cell cycle and also in cell growth.</Typography>
            </Typography>
            <br></br>
            <Typography variant="h6" gutterBottom>
              Disorders Associated With Mitochondria
            </Typography>
            <Typography paragraph>
              Any irregularity in the way mitochondria function can directly affect human health, but often, it is difficult to identify because symptoms differ from person to person. Disorders of the mitochondria can be quite severe; in some cases, they can even cause an organ to fail.
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <Typography component="li">Mitochondrial diseases: Alpers Disease, Barth Syndrome, Kearns-Sayre syndrome (KSS)</Typography>
            </Typography>
</div>
  );
};

export default BiologyContent;
