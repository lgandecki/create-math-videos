from manim import *

class RatioVsDifference(Scene):
    def construct(self):
        # Title
        title = Text("Stosunek kontra Różnica", font_size=48)
        subtitle = Text("×1.5 to zupełnie co innego niż +1.5", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Create two glasses
        glass1 = self.create_glass().shift(LEFT * 3)
        glass2 = self.create_glass().shift(RIGHT * 3)
        
        # Water in both glasses (100ml)
        water1 = Rectangle(width=1.8, height=1.5, fill_color=BLUE, fill_opacity=0.7, stroke_width=0)
        water1.align_to(glass1, DOWN).shift(UP * 0.1)
        
        water2 = Rectangle(width=1.8, height=1.5, fill_color=BLUE, fill_opacity=0.7, stroke_width=0)
        water2.align_to(glass2, DOWN).shift(UP * 0.1)
        
        # Labels
        label1 = Text("100ml Wody", font_size=20).next_to(glass1, DOWN)
        label2 = Text("100ml Wody", font_size=20).next_to(glass2, DOWN)
        
        self.play(
            Create(glass1), Create(glass2),
            FadeIn(water1), FadeIn(water2),
            Write(label1), Write(label2)
        )
        self.wait(2)

        # Labels for operations
        diff_label = Text("Operacja: Różnica", font_size=24).next_to(glass1, UP, buff=1)
        ratio_label = Text("Operacja: Stosunek", font_size=24).next_to(glass2, UP, buff=1)
        
        self.play(Write(diff_label), Write(ratio_label))
        self.wait()

        # First iteration - Difference operation
        concentrate1 = Rectangle(width=1.8, height=0.3, fill_color=RED, fill_opacity=0.8, stroke_width=0)
        concentrate1.next_to(water1, UP, buff=0)
        
        plus_text1 = Text("+10ml", font_size=20, color=RED).next_to(concentrate1, RIGHT)
        
        self.play(
            FadeIn(concentrate1, shift=DOWN),
            FadeIn(plus_text1)
        )
        
        # Mix color for difference
        mixed_water1 = Rectangle(width=1.8, height=1.8, fill_color="#FF66CC", fill_opacity=0.3, stroke_width=0)
        mixed_water1.align_to(glass1, DOWN).shift(UP * 0.1)
        
        self.play(
            Transform(water1, mixed_water1),
            FadeOut(concentrate1),
            FadeOut(plus_text1)
        )
        self.wait()

        # Second and third iterations for difference
        for i in range(2):
            concentrate_small = Rectangle(width=1.8, height=0.3, fill_color=RED, fill_opacity=0.8, stroke_width=0)
            concentrate_small.next_to(water1, UP, buff=0)
            plus_text = Text("+10ml", font_size=20, color=RED).next_to(concentrate_small, RIGHT)
            
            self.play(
                FadeIn(concentrate_small, shift=DOWN),
                FadeIn(plus_text)
            )
            
            # Slightly increase redness
            new_opacity = 0.3 + (i + 1) * 0.05
            mixed_water_new = Rectangle(width=1.8, height=1.8 + (i + 1) * 0.3, 
                                      fill_color="#FF66CC", fill_opacity=new_opacity, stroke_width=0)
            mixed_water_new.align_to(glass1, DOWN).shift(UP * 0.1)
            
            self.play(
                Transform(water1, mixed_water_new),
                FadeOut(concentrate_small),
                FadeOut(plus_text)
            )
            self.wait(0.5)

        # First iteration - Ratio operation
        # 50% of 100ml = 50ml
        concentrate2 = Rectangle(width=1.8, height=0.75, fill_color=RED, fill_opacity=0.8, stroke_width=0)
        concentrate2.next_to(water2, UP, buff=0)
        
        times_text1 = Text("×1.5", font_size=24, color=RED).next_to(concentrate2, RIGHT)
        calc_text1 = Text("(100ml × 0.5 = 50ml)", font_size=16).next_to(times_text1, DOWN)
        
        self.play(
            FadeIn(concentrate2, shift=DOWN),
            FadeIn(times_text1),
            FadeIn(calc_text1)
        )
        
        # Mix color for ratio - much more red
        mixed_water2 = Rectangle(width=1.8, height=2.25, fill_color="#FF0066", fill_opacity=0.6, stroke_width=0)
        mixed_water2.align_to(glass2, DOWN).shift(UP * 0.1)
        
        self.play(
            Transform(water2, mixed_water2),
            FadeOut(concentrate2),
            FadeOut(calc_text1)
        )
        
        # Update volume label
        new_label2 = Text("150ml", font_size=20).next_to(glass2, DOWN)
        self.play(Transform(label2, new_label2))
        self.wait()

        # Second iteration - Ratio operation
        # 50% of 150ml = 75ml
        concentrate3 = Rectangle(width=1.8, height=1.125, fill_color=RED, fill_opacity=0.8, stroke_width=0)
        concentrate3.next_to(water2, UP, buff=0)
        
        times_text2 = Text("×1.5", font_size=24, color=RED).next_to(concentrate3, RIGHT)
        calc_text2 = Text("(150ml × 0.5 = 75ml)", font_size=16).next_to(times_text2, DOWN)
        
        self.play(
            FadeIn(concentrate3, shift=DOWN),
            Transform(times_text1, times_text2),
            FadeIn(calc_text2)
        )
        
        # Mix color for ratio - intense red
        mixed_water3 = Rectangle(width=1.8, height=3.375, fill_color="#CC0033", fill_opacity=0.8, stroke_width=0)
        mixed_water3.align_to(glass2, DOWN).shift(UP * 0.1)
        
        self.play(
            Transform(water2, mixed_water3),
            FadeOut(concentrate3),
            FadeOut(calc_text2)
        )
        
        # Update volume label
        new_label3 = Text("225ml", font_size=20).next_to(glass2, DOWN)
        self.play(Transform(label2, new_label3))
        self.wait(2)

        # Final comparison
        self.play(
            FadeOut(diff_label, ratio_label, times_text1)
        )
        
        comparison_text = Text("Porównanie końcowe", font_size=36)
        comparison_text.to_edge(UP)
        self.play(Write(comparison_text))
        
        # Add visual comparison bars
        linear_growth = NumberLine(
            x_range=[0, 3, 1],
            length=4,
            include_numbers=True,
            include_tip=True,
        ).shift(DOWN * 2 + LEFT * 3)
        
        exponential_growth = NumberLine(
            x_range=[0, 3, 1],
            length=4,
            include_numbers=True,
            include_tip=True,
        ).shift(DOWN * 2 + RIGHT * 3)
        
        linear_label = Text("Wzrost liniowy (+10ml)", font_size=16).next_to(linear_growth, DOWN)
        exp_label = Text("Wzrost wykładniczy (×1.5)", font_size=16).next_to(exponential_growth, DOWN)
        
        # Points on number lines
        linear_points = [
            Dot(linear_growth.n2p(0), color=BLUE),
            Dot(linear_growth.n2p(1), color="#FF66CC"),
            Dot(linear_growth.n2p(2), color="#FF66CC"),
            Dot(linear_growth.n2p(3), color="#FF66CC")
        ]
        
        exp_points = [
            Dot(exponential_growth.n2p(0), color=BLUE),
            Dot(exponential_growth.n2p(1), color="#FF0066"),
            Dot(exponential_growth.n2p(2.5), color="#CC0033"),
        ]
        
        self.play(
            Create(linear_growth), Create(exponential_growth),
            Write(linear_label), Write(exp_label)
        )
        
        self.play(*[Create(dot) for dot in linear_points + exp_points])
        
        # Final message
        final_text = VGroup(
            Text("Różnica: każdy krok dodaje tyle samo", font_size=20, color="#FF66CC"),
            Text("Stosunek: każdy krok mnoży przez stałą", font_size=20, color="#CC0033")
        ).arrange(DOWN, buff=0.5).to_edge(DOWN)
        
        self.play(Write(final_text))
        self.wait(3)

    def create_glass(self):
        glass = VGroup()
        # Glass outline
        left_line = Line(UP * 1.5, DOWN * 1.5)
        right_line = Line(UP * 1.5, DOWN * 1.5).shift(RIGHT * 2)
        bottom_line = Line(left_line.get_end(), right_line.get_end())
        
        glass.add(left_line, right_line, bottom_line)
        return glass