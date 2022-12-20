import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import { Brands, createCourierClient } from '@trycourier/client-graphql';
import type { Client } from 'urql';
import type { BrandConfig } from './Brands/brands.types';
import { brandInitialConfig } from './Brands/initialConfig';

export type Props = {
  children: JSX.Element | JSX.Element[];
  userId: string;
  clientKey: string;
  brandId: string;
};

type CourierContextType = {
  courierClient?: Client;
  brandConfig: BrandConfig;
  isBrandLoading: boolean;
  isBrandLoadingError?: boolean;
};

const CourierContext = createContext<CourierContextType>({
  brandConfig: brandInitialConfig,
  isBrandLoading: false,
  isBrandLoadingError: false,
});

const verifyAllValidProperties = (obj: BrandConfig) =>
  Object.keys(brandInitialConfig).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj, key) &&
      Boolean(obj[key as keyof typeof brandInitialConfig])
  );

function CourierReactNativeProvider({
  children,
  userId,
  clientKey,
  brandId,
}: Props) {
  const [brandConfig, setBrandsConfig] =
    useState<BrandConfig>(brandInitialConfig);
  const [isBrandLoading, setIsBrandLoading] = useState(true);
  const [isBrandLoadingError, setIsBrandLoadingError] = useState(false);

  const courierClient = useMemo(
    () =>
      createCourierClient({
        clientKey,
        userId,
      }),
    []
  );

  const brandApis = Brands({ client: courierClient });

  useEffect(() => {
    const getBrands = async () => {
      setIsBrandLoading(true);
      try {
        const brands = await brandApis.getBrand(brandId);
        if (!brands || !verifyAllValidProperties(brands)) {
          throw new Error('Invalid brand value');
        }
        const typedBrands: BrandConfig = brands;
        setBrandsConfig(typedBrands);
      } catch (err) {
        console.log({ err });
        setIsBrandLoadingError(true);
      } finally {
        setIsBrandLoading(false);
      }
    };
    getBrands();
  }, []);

  return (
    <CourierContext.Provider
      value={{
        courierClient,
        brandConfig,
        isBrandLoading,
        isBrandLoadingError,
      }}
    >
      {children}
    </CourierContext.Provider>
  );
}

export default CourierReactNativeProvider;

export const useReactNativeCourier = () => {
  const { courierClient } = useContext(CourierContext);
  return { courierClient };
};

export const useBrand = () => {
  const {
    brandConfig: {
      colors,
      inapp: {
        emptyState,
        borderRadius,
        widgetBackground,
        disableCourierFooter,
      },
    },
    isBrandLoading,
    isBrandLoadingError,
  } = useContext(CourierContext);
  return {
    colors,
    emptyState,
    borderRadius,
    widgetBackground,
    isBrandLoading,
    disableCourierFooter,
    isBrandLoadingError,
  };
};
