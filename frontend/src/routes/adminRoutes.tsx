import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import BrandDetail from "@/features/Admin/Brand/BrandDetail";
import CreateBrand from "@/features/Admin/Brand/CreateBrand";
import ManageBrand from "@/features/Admin/Brand/ManageBrand";
import UpdateBrand from "@/features/Admin/Brand/UpdateBrand";
import ManageRequest from "@/features/Admin/Cancel-Request/ManageRequest";
import ManageCustomer from "@/features/Admin/Customer/ManageCustomer";
import CreateDacTinh from "@/features/Admin/Dactinh/CreateDacTinh";
import DacTinhDetail from "@/features/Admin/Dactinh/DacTinhDetail";
import ManageDacTinh from "@/features/Admin/Dactinh/ManageDacTinh";
import UpdateDacTinh from "@/features/Admin/Dactinh/UpdateDacTinh";
import RevenueDashboard from "@/features/Admin/DoanhThu";
import CreateIngredient from "@/features/Admin/Ingredient/CreateIngredient";
import IngredientDetail from "@/features/Admin/Ingredient/IngredientDetail";
import ManageIngredient from "@/features/Admin/Ingredient/ManageIngredient";
import UpdateIngredient from "@/features/Admin/Ingredient/UpdateIngredient";
import OrderDetailPage from "@/features/Admin/Order/OrderDetailPage";
import ManageOrdersPage from "@/features/Admin/Order/page";
import CreateOrigin from "@/features/Admin/Origin/CreateOrigin";
import ManageOrigin from "@/features/Admin/Origin/ManageOrigin";
import OriginDetail from "@/features/Admin/Origin/OriginDetail";
import UpdateOrigin from "@/features/Admin/Origin/UpdateOrigin";
import CreatePost from "@/features/Admin/Post/CreatePost";
import ManagePosts from "@/features/Admin/Post/ManagePost";
import PostDetail from "@/features/Admin/Post/PostDetail";
import CreateProductType from "@/features/Admin/ProducType/CreateProductType";
import ManageProductType from "@/features/Admin/ProducType/ManageProductType";
import ProductTypeDetail from "@/features/Admin/ProducType/ProductTypeDetail";
import UpdateProductType from "@/features/Admin/ProducType/UpdateProductType";
import ManageProducts from "@/features/Admin/Product/ManageProduct";
import ProductDetail from "@/features/Admin/Product/ProductDetail";
import UpdateDetailProduct from "@/features/Admin/Product/UpdateDetail";
import ProfileAdmin from "@/features/Admin/Profile/ProfileAdmin";
import CreateSize from "@/features/Admin/Size/CreateSize";
import ManageSize from "@/features/Admin/Size/ManageSize";
import SizeDetail from "@/features/Admin/Size/SizeDetail";
import UpdateSize from "@/features/Admin/Size/UpdateSize";
import CreateSkinType from "@/features/Admin/SkinType/CreateSkinType";
import ManageSkinType from "@/features/Admin/SkinType/ManageSkinType";
import SkinTypeDetail from "@/features/Admin/SkinType/SkinTypeDetail";
import UpdateSkinType from "@/features/Admin/SkinType/UpdateSkinType";
import ManageStatics from "@/features/Admin/Statics/ManageStatics";
import CreateUses from "@/features/Admin/Uses/CreateUses";
import ManageUses from "@/features/Admin/Uses/ManageUses";
import UpdateUses from "@/features/Admin/Uses/UpdateUses";
import UsesDetail from "@/features/Admin/Uses/UsesDetail";
import AddVoucherPage from "@/features/Admin/Voucher/AddVoucherPage";
import ManageVoucher from "@/features/Admin/Voucher/ManageVoucher";
import UpdateVoucher from "@/features/Admin/Voucher/UpdateVoucher";
import VoucherDetail from "@/features/Admin/Voucher/VoucherDetail";
import AddProductPage from "@/features/Admin/components/AddProduct";
import AdminLayout from "@/layouts/adminLayout";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <ProfileAdmin /> },
      {
        path: "dashboard",
        element: <Admin />,
      },
      {
        path: "money",
        element: <RevenueDashboard />,
      },
      {
        path: "customers",
        element: <ManageCustomer />,
      },
      {
        path: "products",
        element: <ManageProducts />,
      },
      {
        path: "cancel-request",
        element: <ManageRequest />,
      },
      {
        path: "brand",
        element: <ManageBrand />,
      },
      {
        path: "create-brand",
        element: <CreateBrand />,
      },
      {
        path: ":id/update-brand",
        element: <UpdateBrand />,
      },
      {
        path: ":id/detail-brand",
        element: <BrandDetail />,
      },
      {
        path: "origin",
        element: <ManageOrigin />,
      },
      {
        path: "voucher",
        element: <ManageVoucher />,
      },
      {
        path: ":id/detail",
        element: <ProductDetail />,
      },
      {
        path: ":id/update-product",
        element: <UpdateDetailProduct />,
      },
      {
        path: "products",
        element: <ManageProducts />,
      },
      {
        path: "createProduct",
        element: <AddProductPage />,
      },
      {
        path: "createVoucher",
        element: <AddVoucherPage />,
      },
      {
        path: "update-voucher/:voucherId",
        element: <UpdateVoucher />,
      },
      {
        path: "orders",
        element: <ManageOrdersPage />,
      },
      {
        path: "order-detail/:orderId",
        element: <OrderDetailPage />,
      },
      {
        path: "profile",
        element: <ProfileAdmin />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
      {
        path: "voucher-detail/:_id",
        element: <VoucherDetail />,
      },
      {
        path: "dac-tinh",
        element: <ManageDacTinh />,
      },
      {
        path: "create-dac-tinh",
        element: <CreateDacTinh />,
      },
      {
        path: ":id/update-dac-tinh",
        element: <UpdateDacTinh />,
      },
      {
        path: ":id/dac-tinh-detail",
        element: <DacTinhDetail />,
      },
      {
        path: "ingredient",
        element: <ManageIngredient />,
      },
      {
        path: ":id/update-ingredient",
        element: <UpdateIngredient />,
      },
      {
        path: ":id/ingredient-detail",
        element: <IngredientDetail />,
      },
      {
        path: "create-ingredient",
        element: <CreateIngredient />,
      },
      {
        path: "skin-type",
        element: <ManageSkinType />,
      },
      {
        path: "create-skin-type",
        element: <CreateSkinType />,
      },
      {
        path: ":id/update-skin-type",
        element: <UpdateSkinType />,
      },
      {
        path: ":id/skin-type-detail",
        element: <SkinTypeDetail />,
      },
      {
        path: "origin",
        element: <ManageOrigin />,
      },
      {
        path: ":id/origin-detail",
        element: <OriginDetail />,
      },
      {
        path: ":id/update-origin",
        element: <UpdateOrigin />,
      },
      {
        path: "create-origin",
        element: <CreateOrigin />,
      },
      {
        path: "uses",
        element: <ManageUses />,
      },
      {
        path: "create-uses",
        element: <CreateUses />,
      },
      {
        path: ":id/uses-detail",
        element: <UsesDetail />,
      },
      {
        path: ":id/uses-detail",
        element: <UsesDetail />,
      },
      {
        path: ":id/update-uses",
        element: <UpdateUses />,
      },
      {
        path: "product-type",
        element: <ManageProductType />,
      },
      {
        path: ":id/product-type-detail",
        element: <ProductTypeDetail />,
      },
      {
        path: ":id/update-product-type",
        element: <UpdateProductType />,
      },
      {
        path: "create-product-type",
        element: <CreateProductType />,
      },
      {
        path: "size",
        element: <ManageSize />,
      },
      {
        path: "create-size",
        element: <CreateSize />,
      },
      {
        path: ":id/update-size",
        element: <UpdateSize />,
      },
      {
        path: ":id/size-detail",
        element: <SizeDetail />,
      },
      {
        path: "posts",
        element: <ManagePosts userRole="ADMIN" />,
      },

      {
        path: "posts/:slug/:id",
        element: <PostDetail />,
      },
    ],
  },
];

export default adminRoutes;
