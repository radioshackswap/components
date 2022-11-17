import { CHAINS, ChainId, Token } from '@radioshackswap/sdk2';
import { ComponentStory } from '@storybook/react';
import React from 'react';
import { CurrencyInput } from '.';

export default {
  component: CurrencyInput,
  title: 'Components/CurrencyInputs',
};

const TemplateCurrencyInput: ComponentStory<typeof CurrencyInput> = (args: any) => <CurrencyInput {...args} />;

export const Default = TemplateCurrencyInput.bind({});
Default.args = {
  label: 'To',
  currency: new Token(
    ChainId.AVALANCHE,
    CHAINS[ChainId.AVALANCHE].contracts!.radio,
    18,
    CHAINS[ChainId.AVALANCHE].radio_symbol!,
    'RadioShack',
  ),
};
