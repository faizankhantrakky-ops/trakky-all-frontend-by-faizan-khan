import FeaturesInnerpage from "@/components/FeaturesInnerpage/FeaturesInnerpage";

export default function FeaturePage({ params }) {
  const { featureName } = params;

  return (
    <div>
    

      <FeaturesInnerpage featureName={featureName} />
    </div>
  );
}
