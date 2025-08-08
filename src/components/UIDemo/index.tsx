import React, { useState } from 'react';
import { 
  BorderBox, 
  ScalableBorder, 
  NineSliceBorder, 
  MedievalBorder, 
  ElaborateBorder, 
  WithOrnateCorners 
} from '../UI';

export const UIDemo: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: "'Pixelify Sans', monospace",
      fontSize: '11px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2 style={{ fontFamily: "'Jacquard 12', monospace", fontSize: '14px' }}>
        Windows 95 UI Kit Demo
      </h2>

      {/* BorderBox Examples */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>BorderBox Components:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <BorderBox style="raised" size={2} customStyle={{ padding: '8px', minWidth: '100px' }}>
            Raised Border
          </BorderBox>
          
          <BorderBox style="inset" size={2} customStyle={{ padding: '8px', minWidth: '100px' }}>
            Inset Border
          </BorderBox>
          
          <BorderBox style="flat" size={1} customStyle={{ padding: '8px', minWidth: '100px' }}>
            Flat Border
          </BorderBox>
        </div>
      </div>

      {/* ScalableBorder Examples */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>ScalableBorder Components:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <ScalableBorder 
            borderStyle="raised" 
            borderWidth={3} 
            style={{ padding: '12px', minWidth: '120px' }}
          >
            Thick Raised Border
          </ScalableBorder>
          
          <ScalableBorder 
            borderStyle="inset" 
            borderWidth={4} 
            style={{ padding: '12px', minWidth: '120px' }}
          >
            Very Thick Inset
          </ScalableBorder>
          
          <ScalableBorder 
            borderStyle="raised" 
            borderWidth={2} 
            cornerRadius={4} 
            style={{ padding: '12px', minWidth: '120px' }}
          >
            Rounded Corners
          </ScalableBorder>
        </div>
      </div>

      {/* NineSliceBorder Examples */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>NineSliceBorder Components:</h3>
        
        {/* Window Example */}
        <NineSliceBorder 
          borderStyle="window" 
          style={{ width: '300px', height: '200px', marginBottom: '10px' }}
        >
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <div style={{ 
              backgroundColor: '#008080', 
              color: 'white', 
              padding: '2px 4px', 
              marginBottom: '4px',
              fontWeight: 'bold'
            }}>
              Window Title Bar
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              This is a resizable window content area. It maintains proper borders at any size.
            </div>
          </div>
        </NineSliceBorder>

        {/* Button Examples */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <NineSliceBorder
            borderStyle="button"
            onClick={() => setActiveButton('btn1')}
            style={{ minWidth: '80px' }}
          >
            Normal Button
          </NineSliceBorder>
          
          <NineSliceBorder
            borderStyle="button"
            disabled={true}
            style={{ minWidth: '80px' }}
          >
            Disabled Button
          </NineSliceBorder>
          
          <NineSliceBorder
            borderStyle={activeButton === 'btn3' ? 'inset' : 'button'}
            onClick={() => setActiveButton(activeButton === 'btn3' ? null : 'btn3')}
            style={{ minWidth: '80px' }}
          >
            Toggle Button
          </NineSliceBorder>
        </div>

        {/* Textbox Examples */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <NineSliceBorder borderStyle="textbox" style={{ minWidth: '150px' }}>
            <input 
              type="text" 
              placeholder="Text input..." 
              style={{ 
                border: 'none', 
                outline: 'none', 
                background: 'transparent',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px',
                width: '100%'
              }} 
            />
          </NineSliceBorder>
          
          <NineSliceBorder borderStyle="textbox" style={{ minWidth: '200px', height: '60px' }}>
            <textarea 
              placeholder="Multi-line text..." 
              style={{ 
                border: 'none', 
                outline: 'none', 
                background: 'transparent',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px',
                width: '100%',
                height: '100%',
                resize: 'none'
              }} 
            />
          </NineSliceBorder>
        </div>
      </div>

      {/* Resizable Demo */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>Resizable Demo:</h3>
        <NineSliceBorder 
          borderStyle="window" 
          style={{ 
            resize: 'both', 
            overflow: 'auto', 
            minWidth: '200px', 
            minHeight: '100px',
            width: '250px',
            height: '150px'
          }}
        >
          <div>
            Try resizing this window by dragging the bottom-right corner. 
            The borders will scale properly at any size!
          </div>
        </NineSliceBorder>
      </div>

      {/* Medieval Ornamental Borders */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>Medieval Ornamental Borders:</h3>
        
        {/* MedievalBorder Examples */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <MedievalBorder cornerStyle="gothic" borderStyle="raised">
            Gothic Corners
          </MedievalBorder>
          
          <MedievalBorder cornerStyle="jeweled" borderStyle="ornate">
            Jeweled Ornate
          </MedievalBorder>
          
          <MedievalBorder cornerStyle="scrollwork" borderStyle="raised">
            Scrollwork Design
          </MedievalBorder>
          
          <MedievalBorder cornerStyle="carved" borderStyle="inset">
            Carved Style
          </MedievalBorder>
        </div>

        {/* ElaborateBorder Examples */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <ElaborateBorder theme="medieval" ornamentLevel="elaborate" size="medium">
            Medieval Theme
          </ElaborateBorder>
          
          <ElaborateBorder theme="gothic" ornamentLevel="decorative" size="medium">
            Gothic Theme
          </ElaborateBorder>
          
          <ElaborateBorder theme="renaissance" ornamentLevel="elaborate" size="large">
            Renaissance
          </ElaborateBorder>
          
          <ElaborateBorder theme="celtic" ornamentLevel="decorative" size="medium">
            Celtic Design
          </ElaborateBorder>
        </div>

        {/* WithOrnateCorners Examples */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <WithOrnateCorners cornerStyle="fleurDeLis" cornerSize={20}>
            <NineSliceBorder borderStyle="window" style={{ padding: '10px', minWidth: '120px' }}>
              Fleur-de-Lis Corners
            </NineSliceBorder>
          </WithOrnateCorners>
          
          <WithOrnateCorners cornerStyle="celtic" cornerSize={18} cornerColor="#228B22">
            <NineSliceBorder borderStyle="raised" style={{ padding: '10px', minWidth: '120px' }}>
              Celtic Corners
            </NineSliceBorder>
          </WithOrnateCorners>
          
          <WithOrnateCorners cornerStyle="runes" cornerSize={16} cornerColor="#8B0000">
            <NineSliceBorder borderStyle="button" style={{ padding: '10px', minWidth: '120px' }}>
              Runic Corners
            </NineSliceBorder>
          </WithOrnateCorners>
        </div>
      </div>

      {/* Mixed Styles Demo */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>Mixed Styles - Medieval Windows:</h3>
        
        <WithOrnateCorners 
          cornerStyle="gothic" 
          cornerSize={24} 
          cornerColor="#FFD700"
        >
          <NineSliceBorder 
            borderStyle="window" 
            style={{ 
              width: '400px', 
              height: '250px',
              resize: 'both',
              overflow: 'auto'
            }}
          >
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <div style={{ 
                backgroundColor: '#8B4513', 
                color: '#F5DEB3', 
                padding: '4px 8px', 
                marginBottom: '8px',
                fontWeight: 'bold',
                fontFamily: "'Jacquard 12', monospace"
              }}>
                ⚔️ Medieval Window ⚔️
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                This window combines Windows 95 functionality with medieval aesthetics. 
                The ornate corners add character while maintaining the practical resizable interface.
                <br /><br />
                Try resizing this window to see how the ornamental corners stay perfectly positioned!
              </div>
            </div>
          </NineSliceBorder>
        </WithOrnateCorners>
      </div>
    </div>
  );
};
