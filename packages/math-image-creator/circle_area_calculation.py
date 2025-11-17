from manim import *
import numpy as np

class CircleAreaCalculation(Scene):
    def construct(self):
        # Title
        title = Text("Pole koła", font_size=48)
        subtitle = Text("Obliczanie pola koła o promieniu 4", font_size=32, color=BLUE)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create circle with radius 4
        radius = 2  # Visual radius (actual value is 4)
        circle = Circle(radius=radius, color=BLUE, stroke_width=4)
        circle.shift(LEFT * 3)
        
        # Create radius line
        center = circle.get_center()
        radius_end = center + RIGHT * radius
        radius_line = Line(center, radius_end, color=YELLOW, stroke_width=3)
        
        # Center dot
        center_dot = Dot(center, color=WHITE, radius=0.08)
        
        # Radius label
        radius_label = Text("r = 4", font_size=24, color=YELLOW)
        radius_label.next_to(radius_line, UP, buff=0.1)
        
        # Show circle with radius
        self.play(Create(circle))
        self.play(Create(radius_line), FadeIn(center_dot))
        self.play(Write(radius_label))
        self.wait(1)

        # Show the formula
        formula_text = Text("Wzór na pole koła:", font_size=32)
        formula_text.to_edge(UP).shift(RIGHT * 2)
        
        formula = Text("A = πr²", font_size=48, color=GREEN)
        formula.next_to(formula_text, DOWN, buff=0.5)
        
        self.play(Write(formula_text))
        self.play(Write(formula))
        self.wait(1)

        # Substitute the value
        step1 = Text("A = π × 4²", font_size=36)
        step1.next_to(formula, DOWN, buff=0.5)
        
        self.play(Write(step1))
        self.wait(0.5)
        
        step2 = Text("A = π × 16", font_size=36)
        step2.next_to(step1, DOWN, buff=0.3)
        
        self.play(Write(step2))
        self.wait(0.5)
        
        # Show approximate value
        step3 = Text("A ≈ 3.14 × 16", font_size=36)
        step3.next_to(step2, DOWN, buff=0.3)
        
        self.play(Write(step3))
        self.wait(0.5)
        
        result = Text("A ≈ 50.24", font_size=42, color=YELLOW)
        result.next_to(step3, DOWN, buff=0.5)
        box = SurroundingRectangle(result, color=YELLOW, buff=0.2)
        
        self.play(Write(result), Create(box))
        self.wait(1)

        # Visual demonstration - divide circle into sectors
        self.play(
            FadeOut(formula_text), FadeOut(formula),
            FadeOut(step1), FadeOut(step2), FadeOut(step3),
            FadeOut(result), FadeOut(box)
        )
        
        explanation = Text("Wizualizacja: dzielimy koło na sektory", font_size=28)
        explanation.to_edge(UP).shift(RIGHT * 2)
        self.play(Write(explanation))
        
        # Create sectors using AnnularSector
        n_sectors = 8
        sectors = VGroup()
        colors = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK, TEAL]
        
        for i in range(n_sectors):
            start_angle = i * TAU / n_sectors
            sector = AnnularSector(
                inner_radius=0,
                outer_radius=radius,
                start_angle=start_angle,
                angle=TAU/n_sectors,
                color=colors[i],
                fill_opacity=0.6,
                stroke_width=2
            )
            sector.move_to(center)
            sectors.add(sector)
        
        self.play(
            FadeOut(circle),
            *[FadeIn(sector) for sector in sectors]
        )
        self.wait(1)
        
        # Rearrange sectors to approximate rectangle
        self.play(FadeOut(explanation))
        
        new_explanation = Text("Układamy sektory w przybliżony prostokąt", font_size=28)
        new_explanation.to_edge(UP).shift(RIGHT * 2)
        self.play(Write(new_explanation))
        
        # Move sectors to form approximate rectangle
        rect_width = PI * radius  # Half circumference
        rect_height = radius
        
        for i, sector in enumerate(sectors):
            if i % 2 == 0:
                # Even sectors go up
                new_pos = RIGHT * (3 - rect_width/2 + i * rect_width/n_sectors) + UP * 0.5
                self.play(
                    sector.animate.move_to(new_pos).rotate(PI/2),
                    run_time=0.5
                )
            else:
                # Odd sectors go down
                new_pos = RIGHT * (3 - rect_width/2 + i * rect_width/n_sectors) + DOWN * 0.5
                self.play(
                    sector.animate.move_to(new_pos).rotate(-PI/2),
                    run_time=0.5
                )
        
        # Draw rectangle outline
        rect_outline = Rectangle(
            width=rect_width,
            height=rect_height * 2,
            color=WHITE,
            stroke_width=3
        )
        rect_outline.shift(RIGHT * 3)
        
        self.play(Create(rect_outline))
        
        # Show dimensions
        width_label = Text("długość ≈ πr = π×4", font_size=20)
        width_label.next_to(rect_outline, DOWN, buff=0.2)
        
        height_label = Text("szerokość = r = 4", font_size=20)
        height_label.next_to(rect_outline, RIGHT, buff=0.2)
        
        self.play(Write(width_label), Write(height_label))
        self.wait(1)
        
        # Show area calculation
        rect_area = Text("Pole prostokąta = długość × szerokość", font_size=24)
        rect_area.to_edge(DOWN, buff=2)
        
        rect_calc = Text("A = πr × r = πr² = π × 4² = 50.24", font_size=28, color=YELLOW)
        rect_calc.next_to(rect_area, DOWN, buff=0.3)
        
        self.play(Write(rect_area))
        self.play(Write(rect_calc))
        
        # Final summary
        self.wait(1)
        self.play(
            *[FadeOut(mob) for mob in self.mobjects if mob != rect_calc]
        )
        
        # Show final result with circle
        final_circle = Circle(radius=radius, color=BLUE, fill_opacity=0.3, stroke_width=4)
        final_circle.move_to(ORIGIN)
        
        final_text = VGroup(
            Text("Pole koła o promieniu r = 4", font_size=36),
            Text("A = πr² = π × 16 ≈ 50.24", font_size=42, color=YELLOW)
        ).arrange(DOWN, buff=0.5)
        final_text.next_to(final_circle, DOWN, buff=1)
        
        self.play(
            Transform(rect_calc, final_text[1]),
            Create(final_circle),
            Write(final_text[0])
        )
        
        # Add unit
        unit_text = Text("jednostek kwadratowych", font_size=24, color=GRAY)
        unit_text.next_to(final_text[1], DOWN, buff=0.2)
        self.play(Write(unit_text))
        
        self.wait(3)