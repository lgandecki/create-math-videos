from manim import *

class PowerOfTwo(Scene):
    def construct(self):
        # Title
        title = Text("The Power of Two", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create hand silhouette (right hand, palm facing viewer)
        hand = self.create_hand()
        hand.shift(DOWN * 0.5)
        
        # Create finger labels with binary values
        finger_labels = []
        binary_values = [1, 2, 4, 8, 16]  # 2^0 to 2^4
        finger_positions = [
            UP * 1.2 + LEFT * 0.3,   # Thumb
            UP * 1.0 + LEFT * 0.1,   # Index finger
            UP * 0.8 + RIGHT * 0.1,  # Middle finger
            UP * 0.6 + RIGHT * 0.3,  # Ring finger
            UP * 0.4 + RIGHT * 0.5   # Pinky finger
        ]
        
        for i, (pos, value) in enumerate(zip(finger_positions, binary_values)):
            # Create label for binary value
            label = MathTex(f"2^{{{i}}} = {value}", font_size=24, color=YELLOW)
            label.next_to(hand, UP, buff=0.3)
            label.shift(pos)
            finger_labels.append(label)
        
        # Create hand and finger labels
        self.play(FadeIn(hand))
        self.wait(1)
        
        # Show binary values for each finger
        for label in finger_labels:
            self.play(Write(label))
            self.wait(0.5)
        
        # Add explanation text
        explanation = Text(
            "A raised finger means 'ON' (1), a lowered finger means 'OFF' (0).",
            font_size=24,
            color=GREEN
        )
        explanation.to_edge(DOWN)
        self.play(Write(explanation))
        self.wait(2)
        
        # Create initial state (all fingers OFF)
        total_text = MathTex("Total = 0", font_size=36, color=WHITE)
        total_text.next_to(hand, DOWN, buff=1.5)
        self.play(Write(total_text))
        self.wait(2)
        
        # Show how to calculate values with raised fingers
        # First, raise thumb (2^0 = 1)
        self.raise_finger(0, hand)
        self.play(Transform(total_text, MathTex("Total = 1", font_size=36, color=WHITE)))
        self.wait(1)
        
        # Raise index finger (2^1 = 2) 
        self.raise_finger(1, hand)
        self.play(Transform(total_text, MathTex("Total = 3", font_size=36, color=WHITE)))
        self.wait(1)
        
        # Raise middle finger (2^2 = 4)
        self.raise_finger(2, hand)
        self.play(Transform(total_text, MathTex("Total = 7", font_size=36, color=WHITE)))
        self.wait(1)
        
        # Raise ring finger (2^3 = 8)
        self.raise_finger(3, hand)
        self.play(Transform(total_text, MathTex("Total = 15", font_size=36, color=WHITE)))
        self.wait(1)
        
        # Raise pinky finger (2^4 = 16)
        self.raise_finger(4, hand)
        self.play(Transform(total_text, MathTex("Total = 31", font_size=36, color=WHITE)))
        self.wait(2)
        
        # Show the final equation
        final_equation = MathTex(
            "1 + 2 + 4 + 8 + 16 = 31", 
            font_size=36, 
            color=YELLOW
        )
        final_equation.next_to(total_text, DOWN, buff=0.5)
        self.play(Write(final_equation))
        self.wait(3)
        
        # Fade out everything
        self.play(
            FadeOut(VGroup(hand, *finger_labels, explanation, total_text, final_equation, title))
        )
        
    def create_hand(self):
        # Create a simple hand silhouette (right hand, palm facing viewer)
        # Palm
        palm = Ellipse(width=1.2, height=0.8, fill_color=LIGHT_BROWN, fill_opacity=0.3, stroke_width=2)
        
        # Fingers
        fingers = VGroup()
        finger_positions = [
            UP * 1.2 + LEFT * 0.3,   # Thumb
            UP * 1.0 + LEFT * 0.1,   # Index finger
            UP * 0.8 + RIGHT * 0.1,  # Middle finger
            UP * 0.6 + RIGHT * 0.3,  # Ring finger
            UP * 0.4 + RIGHT * 0.5   # Pinky finger
        ]
        
        for pos in finger_positions:
            finger = Ellipse(width=0.15, height=0.4, fill_color=LIGHT_BROWN, fill_opacity=0.3, stroke_width=2)
            finger.move_to(pos)
            fingers.add(finger)
        
        # Thumb (special case)
        thumb = Ellipse(width=0.15, height=0.3, fill_color=LIGHT_BROWN, fill_opacity=0.3, stroke_width=2)
        thumb.move_to(UP * 1.2 + LEFT * 0.3)
        thumb.rotate(-PI/6, about_point=thumb.get_center())
        
        return VGroup(palm, fingers, thumb)
    
    def raise_finger(self, finger_index, hand):
        # Get the finger to raise
        fingers = hand[1]  # All fingers are in the second element of the group
        if finger_index < len(fingers):
            # Animate raising the finger
            self.play(
                fingers[finger_index].animate.shift(UP * 0.2),
                run_time=0.5
            )